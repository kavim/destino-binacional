import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Shared/SelectInput';
import InputError from '@/Components/InputError';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImagicLoader from '@/Components/ImagicLoader';
import Categories from './Categories';
import DeleteButton from '@/Shared/DeleteButton';

export default function Form({ handleOnChange, submit, data, errors, processing, onDelete = null }) {

    const { cities, place_types } = usePage().props;

    const onCorte = (image) => {
        handleOnChange({ target: { name: 'featured_image', value: image } });
    }

    const getTools = () => {
        return [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo"
        ];
    }

    const handleCheck = (event) => {
        let updatedList = [...data.category_ids];
        let checkboxId = parseInt(event.target.value);

        if (event.target.checked) {
            updatedList = [...data.category_ids, checkboxId];
        } else {
            updatedList.splice(data.category_ids.indexOf(checkboxId), 1);
        }

        handleOnChange({ target: { name: 'category_ids', value: updatedList } });
    };

    return (
        <form onSubmit={submit}>
            <div className='mb-5 bg-stone-200 rounded-2xl p-2'>
                <div className='flex justify-center'>
                    {data.featured_image ? (
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
            <div className="my-3">
                <InputLabel htmlFor="name" value="Nombre" />
                <TextInput
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    onChange={handleOnChange}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="description_es" value="Descripción en Español" />
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        toolbar: getTools()
                    }}
                    data={data.description_es || "<p>Descripción en Español</p>"}
                    name="description_es"
                    value={data.description_es}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        handleOnChange({ target: { name: 'description_es', value: data } });
                    }}
                />
                <InputError message={errors.description_es} className="mt-2" />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="description_pt" value="Descripción en Portugués" />
                <CKEditor
                    editor={ClassicEditor}
                    data={data.description_pt || "<p>Descripción en Portugués</p>"}
                    name="description_pt"
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        handleOnChange({ target: { name: 'description_pt', value: data } });
                    }}
                    className="rounded"
                />
                <InputError message={errors.description_pt} className="mt-2" />
            </div>
            <hr />
            <div className="my-3">
                <InputLabel htmlFor="google_maps_src" value="Google Maps link" />
                <TextInput
                    type="text"
                    name="google_maps_src"
                    value={data.google_maps_src}
                    className="mt-1 block w-full"
                    onChange={handleOnChange}
                />
                <InputError message={errors.google_maps_src} className="mt-2" />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="address" value="Dirección" />
                <TextInput
                    type="text"
                    name="address"
                    value={data.address}
                    className="mt-1 block w-full"
                    placeholder="Address"
                    onChange={handleOnChange}
                />
                <InputError message={errors.address} className="mt-2" />
            </div>
            <div className="divider mt-10">Categorias</div>
            <div className="my-5">
                <Categories handleCheck={handleCheck} />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="city_id" value="Ciudad" />
                <SelectInput
                    name="city_id"
                    value={data.city_id}
                    onChange={handleOnChange}
                    className="mt-1 block w-full"
                >
                    <option defaultValue hidden>Elige una Ciudad</option>
                    {Object.keys(cities).map((key, i) => (
                        <option key={i} value={cities[key].id}>
                            {cities[key].name}
                        </option>
                    ))}
                </SelectInput>

                <InputError message={errors.city_id} className="mt-2" />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="place_type_id" value="Tipo" />
                <SelectInput
                    name="place_type_id"
                    value={data.place_type_id}
                    onChange={handleOnChange}
                    className="mt-1 block w-full"
                >
                    <option defaultValue hidden>Elija una opción</option>
                    {Object.keys(place_types).map((key, i) => (
                        <option key={i} value={place_types[key].id}>
                            {place_types[key].name}
                        </option>
                    ))}
                </SelectInput>

                <InputError message={errors.type_id} className="mt-2" />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="order" value="Ordem" />
                <TextInput
                    type="number"
                    name="order"
                    value={data.order}
                    className="mt-1 block w-full"
                    onChange={handleOnChange}
                    placeholder="Order number (0, 1, 2, 3...)"
                    min="0"
                    max="9999"
                />

                <InputError message={errors.order} className="mt-2" />
            </div>
            <div>
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
            </div>
        </form>
    );
}