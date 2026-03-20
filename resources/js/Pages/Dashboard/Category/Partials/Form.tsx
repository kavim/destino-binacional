import { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import ImagicLoader from '@/Components/ImagicLoader';
import DeleteButton from '@/Shared/DeleteButton';

export default function Form({ handleOnChange, submit, data, errors, onDelete, parent = null, processing, onIconChange }) {
    const [iconImage, setIconImage] = useState(null);

    const onCorte = (image) => {
        handleOnChange({ target: { name: 'image', value: image } });
    }

    const onIconImageChange = (event) => {
        const file = event.target.files[0];
        setIconImage(URL.createObjectURL(file));
        onIconChange(event);
    };

    useEffect(() => {
        // Set the iconImage when editing a category
        if (data.icon) {
            setIconImage(data.icon);
        }
    }, [data.icon]);

    return (
        <>
            <form onSubmit={submit}>
                <div className="divider">Identificación</div>

                <div className="my-5">
                    <InputLabel htmlFor="name_es" value="Nombre" />
                    <TextInput
                        type="text"
                        name="name_es"
                        value={data.name_es}
                        className="mt-1 block w-full"
                        autoComplete="name_es"
                        onChange={handleOnChange}
                        placeholder="Nombre en español"
                    />
                    <InputError message={errors.name_es} className="mt-2" />
                </div>
                <div className="my-5">
                    <InputLabel htmlFor="name_pt" value="Nome" />
                    <TextInput
                        type="text"
                        name="name_pt"
                        value={data.name_pt}
                        className="mt-1 block w-full"
                        autoComplete="name_pt"
                        onChange={handleOnChange}
                        placeholder="Nome em português"
                    />
                    <InputError message={errors.name_pt} className="mt-2" />
                </div>

                {!parent && (
                    <>
                        <div className="divider mt-10">Estilo</div>
                        <div className='mb-5 bg-stone-200 rounded-2xl p-2'>
                            <div className='flex justify-center'>
                                {data.featured_image && !data.image ? (
                                    <div className="mb-3">
                                        <img src={data.featured_image} alt="featured_image" className='w-96 rounded-2xl' />
                                    </div>
                                ) : (
                                    <>
                                        {(data.image) && (
                                            <div className="mb-3">
                                                <img src={data.image} alt="current_image" className='w-96 rounded-2xl' />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <ImagicLoader onCorte={onCorte}></ImagicLoader>

                            <InputError message={errors.featured_image} className="mt-2" />
                            <InputError message={errors.image} className="mt-2" />
                        </div>
                        <div className="my-5">
                            <InputLabel htmlFor="color" value="Color" />
                            <TextInput
                                type="text"
                                name="color"
                                value={data.color}
                                className="mt-1 block w-full rounded-lg"
                                autoComplete="color"
                                onChange={handleOnChange}
                                placeholder="Color"
                            />
                            <InputError message={errors.color} className="mt-2" />
                        </div>
                        <div>
                            <div>
                                <InputLabel htmlFor="icon" value="Icono:" />
                                {iconImage && (

                                    <div className='flex justify-start items-center my-2'>
                                        <div className='p-2 rounded-full' style={{ backgroundColor: data.color }}>
                                            <img src={iconImage} alt="icon" className="w-10 h-10 rounded-full" />
                                        </div>
                                    </div>
                                )}

                                <input type="file" name="icon_image" onChange={onIconImageChange} />

                                <div className="my-5 p-2 border rounded-md">
                                    <p>Recomendamos descargar los iconos SVG <a href="https://www.svgrepo.com/" className="text-blue-500 underline">de este catálogo</a></p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {
                    onDelete ? (
                        <div className="flex justify-between mt-5">
                            <DeleteButton type='button' onDelete={onDelete}>
                                Delete
                            </DeleteButton>
                            <PrimaryButton disabled={processing}>
                                Save
                            </PrimaryButton>
                        </div>
                    ) : (
                        <div className="flex justify-end mt-5">
                            <PrimaryButton disabled={processing}>
                                Save
                            </PrimaryButton>
                        </div>
                    )
                }
            </form >
        </>
    );
}