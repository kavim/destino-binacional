import React, { useState } from "react";
import ImageUpload from "@/Shared/ImageUpload";
import ImageCropper from "@/Shared/ImageCropper";
import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";

type CroppedArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};

function ImagicLoader({ onCorte }: { onCorte: (dataURL: string) => void }) {
    const [image, setImage] = useState("");
    const [currentPage, setCurrentPage] = useState<"choose-img" | "crop-img">(
        "choose-img",
    );
    const [modalShow, setModalShow] = useState(false);

    const onImageSelected = (selectedImg: string) => {
        setImage(selectedImg);
        setCurrentPage("crop-img");
        setModalShow(true);
    };

    const onCropDone = (imgCroppedArea: CroppedArea | null) => {
        if (!imgCroppedArea) return;
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;

        const context = canvasEle.getContext("2d");

        const imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = function () {
            context!.drawImage(
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

            const dataURL = canvasEle.toDataURL("image/webp");

            setCurrentPage("choose-img");
            onCorte(dataURL);
            setModalShow(false);
        };
    };

    const onCropCancel = () => {
        setCurrentPage("choose-img");
        setImage("");
        setModalShow(false);
    };

    return (
        <div>
            <Modal show={modalShow} onClose={() => setModalShow(false)}>
                {currentPage === "choose-img" && (
                    <div className='k-gradient' >
                        <div className='w-full flex justify-end px-2 pt-2'>
                            <Button type='button' variant="ghost" size="icon" onClick={() => setModalShow(false)} className="rounded-full text-white hover:bg-white/20">
                                <X className="h-5 w-5" />
                            </Button>
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
