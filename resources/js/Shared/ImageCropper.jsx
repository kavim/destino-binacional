import PrimaryButton from '@/Components/PrimaryButton';
import React, { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({ image, onCropDone, onCropCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(16 / 9);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    };

    return (
        <div className="w-full h-auto flex flex-col">
            <div className='p-5 relative flex min-h-[40vh] max-h-[60vh]'>
                <Cropper
                    image={image}
                    aspect={aspectRatio}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <div className="m-2 p-2 action-btns">
                {/* <div className="aspect-ratios" onChange={onAspectRatioChange}>
                    <input type="radio" value={1 / 1} name="ratio" /> 1:1
                    <input type="radio" value={5 / 4} name="ratio" /> 5:4
                    <input type="radio" value={4 / 3} name="ratio" /> 4:3
                    <input type="radio" value={3 / 2} name="ratio" /> 3:2
                    <input type="radio" value={5 / 3} name="ratio" /> 5:3
                    <input type="radio" value={16 / 9} name="ratio" /> 16:9
                    <input type="radio" value={3 / 1} name="ratio" /> 3:1
                </div> */}

                <div className='flex flex-row justify-between'>
                    <button className="btn btn-outline" onClick={onCropCancel}>
                        <i className="fa-solid fa-ban mr-2"></i>
                        Cancelar
                    </button>

                    <PrimaryButton
                        onClick={() => {
                            onCropDone(croppedArea);
                        }}
                    >
                        <i className="fa-solid fa-crop-simple mr-2"></i>
                        Listo
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;
