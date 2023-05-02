import PrimaryButton from '@/Components/PrimaryButton';
import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({ image, onCropDone, onCropCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(null);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    };

    useEffect(() => {
        if (!aspectRatio) {
            setAspectRatio(4 / 3);
        }
    }, []);

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

            <div className="m-2 p-2">
                <span>Por favor, seleccione la relación de aspecto</span>
                <div className="p-5 flex justify-between items-center" onChange={onAspectRatioChange}>
                    <label htmlFor="11" className='flex justify-center align-middle items-center p-1' >
                        <input id='11' type="radio" value={1 / 1} name="ratio" className='mx-2' /> 1:1
                    </label>
                    <label htmlFor="54">
                        <input id='54' type="radio" value={5 / 4} name="ratio" /> 5:4
                    </label>
                    <label htmlFor="43">
                        <input id='43' type="radio" value={4 / 3} name="ratio" /> 4:3
                    </label>
                    <label htmlFor="32">
                        <input id='32' type="radio" value={3 / 2} name="ratio" /> 3:2
                    </label>
                    <label htmlFor="53">
                        <input id='53' type="radio" value={5 / 3} name="ratio" /> 5:3
                    </label>
                    <label htmlFor="169">
                        <input id='169' type="radio" value={16 / 9} name="ratio" /> 16:9
                    </label>
                </div>

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
