import PrimaryButton from "@/Components/PrimaryButton";
import React, { useState } from "react";
import Cropper from "react-easy-crop";

type CroppedArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};

interface ImageCropperProps {
    image: string;
    onCropDone: (area: CroppedArea | null) => void;
    onCropCancel: () => void;
}

function ImageCropper({ image, onCropDone, onCropCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<CroppedArea | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

    const onCropComplete = (
        _croppedAreaPercentage: unknown,
        croppedAreaPixels: CroppedArea,
    ) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onAspectRatioChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = Number(event.target.value);
        setAspectRatio(Number.isFinite(value) && value > 0 ? value : 4 / 3);
    };

    return (
        <div className="w-full h-auto flex flex-col">
            <div className="p-5 relative flex min-h-[40vh] max-h-[60vh]">
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
                    <label htmlFor="11" className="flex justify-center align-middle items-center p-1">
                        <input id="11" type="radio" value={1 / 1} name="ratio" className="mx-2" /> 1:1
                    </label>
                    <label htmlFor="54">
                        <input id="54" type="radio" value={5 / 4} name="ratio" /> 5:4
                    </label>
                    <label htmlFor="43">
                        <input id="43" type="radio" value={4 / 3} name="ratio" /> 4:3
                    </label>
                    <label htmlFor="32">
                        <input id="32" type="radio" value={3 / 2} name="ratio" /> 3:2
                    </label>
                    <label htmlFor="53">
                        <input id="53" type="radio" value={5 / 3} name="ratio" /> 5:3
                    </label>
                    <label htmlFor="169">
                        <input id="169" type="radio" value={16 / 9} name="ratio" /> 16:9
                    </label>
                </div>

                <div className="flex flex-row justify-between">
                    <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground" onClick={onCropCancel}>
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
