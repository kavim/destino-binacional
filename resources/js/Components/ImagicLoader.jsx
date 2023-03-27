import React, { useState } from "react";
import ImageUpload from '@/Shared/ImageUpload';
import ImageCropper from '@/Shared/ImageCropper';
import Modal from '@/Components/Modal';

function ImagicLoader({ onCorte }) {
    const [image, setImage] = useState("");
    const [currentPage, setCurrentPage] = useState("choose-img");
    const [imgAfterCrop, setImgAfterCrop] = useState("");
    const [modalShow, setModalShow] = useState(false);

    // Invoked when new image file is selected
    const onImageSelected = (selectedImg) => {
        setImage(selectedImg);
        setCurrentPage("crop-img");
        setModalShow(true);
    };

    // Generating Cropped Image When Done Button Clicked
    const onCropDone = (imgCroppedArea) => {
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;

        const context = canvasEle.getContext("2d");

        let imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            const dataURL = canvasEle.toDataURL("image/jpeg");

            setImgAfterCrop(dataURL);
            setCurrentPage("img-cropped");
            onCorte(dataURL);
            setModalShow(false);
        };
    };

    // Handle Cancel Button Click
    const onCropCancel = () => {
        setCurrentPage("choose-img");
        setImage("");
        setCurrentPage("");
        setModalShow(modalShow ? false : true);
    };

    return (
        <div>
            <Modal show={modalShow}>
                {currentPage === "choose-img" && (
                    <div className='k-gradient' >
                        <div className='w-full flex justify-end px-2 pt-2'>
                            <button type='button' className="btn btn-circle btn-sm btn-white" >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className='pb-5'>
                            <ImageUpload setImage={setImage} onImageSelected={onImageSelected} />
                        </div>
                    </div>
                )}
                {currentPage === "crop-img" && (
                    <ImageCropper
                        image={image}
                        onCropDone={onCropDone}
                        onCropCancel={onCropCancel}
                    />
                )}
            </Modal>

            <ImageUpload setImage={setImage} onImageSelected={onImageSelected} />

        </div>
    );
}

export default ImagicLoader;