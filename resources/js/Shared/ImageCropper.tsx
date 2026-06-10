import PrimaryButton from "@/Components/PrimaryButton";
import React, { useEffect, useState } from "react";
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

const FALLBACK_ASPECT_RATIO = 4 / 3;

const ASPECT_RATIO_OPTIONS = [
    { id: "original", label: "Original" },
    { id: "1:1", label: "1:1", value: 1 / 1 },
    { id: "4:5", label: "4:5 Feed Instagram", value: 4 / 5 },
    { id: "9:16", label: "9:16 Story / Reels", value: 9 / 16 },
    { id: "16:9", label: "16:9 Web", value: 16 / 9 },
    { id: "4:3", label: "4:3", value: 4 / 3 },
    { id: "3:2", label: "3:2", value: 3 / 2 },
] as const;

type AspectRatioOption = (typeof ASPECT_RATIO_OPTIONS)[number]["id"];

const getAspectRatio = (
    option: AspectRatioOption,
    naturalAspectRatio: number,
) => {
    const selected = ASPECT_RATIO_OPTIONS.find((item) => item.id === option);

    if (selected && "value" in selected) {
        return selected.value;
    }

    return naturalAspectRatio;
};

function ImageCropper({ image, onCropDone, onCropCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<CroppedArea | null>(null);
    const [naturalAspectRatio, setNaturalAspectRatio] = useState(
        FALLBACK_ASPECT_RATIO,
    );
    const [aspectRatioOption, setAspectRatioOption] =
        useState<AspectRatioOption>("original");
    const aspectRatio = getAspectRatio(aspectRatioOption, naturalAspectRatio);

    useEffect(() => {
        if (!image) {
            setNaturalAspectRatio(FALLBACK_ASPECT_RATIO);
            setAspectRatioOption("original");
            return;
        }

        let isMounted = true;
        const previewImage = new Image();

        previewImage.onload = () => {
            if (!isMounted) {
                return;
            }

            const naturalWidth = previewImage.naturalWidth;
            const naturalHeight = previewImage.naturalHeight;

            if (naturalWidth > 0 && naturalHeight > 0) {
                setNaturalAspectRatio(naturalWidth / naturalHeight);
            }

            setAspectRatioOption("original");
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        };

        previewImage.src = image;

        return () => {
            isMounted = false;
        };
    }, [image]);

    const onCropComplete = (
        _croppedAreaPercentage: unknown,
        croppedAreaPixels: CroppedArea,
    ) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onAspectRatioChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value as AspectRatioOption;
        const nextValue = ASPECT_RATIO_OPTIONS.some((item) => item.id === value)
            ? value
            : "original";

        setAspectRatioOption(nextValue);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
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
                <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                    {ASPECT_RATIO_OPTIONS.map((option) => (
                        <label
                            key={option.id}
                            htmlFor={`aspect-${option.id}`}
                            className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm"
                        >
                            <input
                                id={`aspect-${option.id}`}
                                type="radio"
                                value={option.id}
                                name="aspect-ratio"
                                checked={aspectRatioOption === option.id}
                                onChange={onAspectRatioChange}
                            />
                            {option.label}
                        </label>
                    ))}
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
