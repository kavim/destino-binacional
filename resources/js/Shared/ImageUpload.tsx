import React, { useRef } from "react";

type ImageUploadProps = {
    onImageSelected: (dataUrl: string) => void;
    setImage?: React.Dispatch<React.SetStateAction<string>>;
};

function ImageUpload({ onImageSelected }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const imageInputed = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function () {
                const result = reader.result;
                onImageSelected(typeof result === 'string' ? result : '');
            };
        }
    };

    const onChooseImg = () => {
        inputRef.current.click();
    };

    return (
        <div className='text-center'>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={imageInputed}
                style={{ display: "none" }}
            />

            <button type="button" onClick={onChooseImg} className="group relative z-30 box-border inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-md bg-primary px-8 py-2 font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/35 ring-offset-2 ring-offset-background transition-all duration-300 ease-in-out hover:bg-primary/90 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-ring dark:shadow-black/25">
                <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-foreground/10 group-hover:translate-x-0"></span>
                <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-foreground/10 group-hover:translate-x-0"></span>
                <span className="relative z-20 flex items-center text-sm">
                    <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                    Elije una imagen
                </span>
            </button>
        </div>
    );
}

export default ImageUpload;
