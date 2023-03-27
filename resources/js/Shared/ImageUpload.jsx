import React, { useRef } from "react";

function ImageUpload({ onImageSelected }) {
    const inputRef = useRef();

    const imageInputed = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function (e) {
                onImageSelected(reader.result);
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

            <button type='button' onClick={onChooseImg} className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-2 overflow-hidden font-semibold text-white transition-all duration-300 bg-indigo-500 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-indigo-300 ease focus:outline-none">
                <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                <span className="relative z-20 flex items-center text-sm">
                    <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                    Elije una imagen
                </span>
            </button>
        </div>
    );
}

export default ImageUpload;
