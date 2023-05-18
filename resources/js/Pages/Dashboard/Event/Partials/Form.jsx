import { usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Shared/SelectInput';
import InputError from '@/Components/InputError';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImagicLoader from '@/Components/ImagicLoader';
import DataPickerInputStart from '@/Shared/DataPickerInputStart';
import DataPickerInputEnd from '@/Shared/DataPickerInputEnd';
import DeleteButton from '@/Shared/DeleteButton';
import Tags from './Tags';

export default function Form({ handleOnChange, submit, data, errors, processing, onDelete }) {
    const { categories, cities, grouped_categories, parent_tags } = usePage().props;

    const onCorte = (image) => {
        handleOnChange({ target: { name: 'featured_image', value: image } });
    }

    const check = () => {
        handleOnChange({ target: { name: 'is_online', value: !data.is_online } });
    }

    const handleCheck = (event) => {
        let updatedList = [...data.tag_ids];
        let checkboxId = parseInt(event.target.value);

        if (event.target.checked) {
            updatedList = [...data.tag_ids, checkboxId];
        } else {
            updatedList.splice(data.tag_ids.indexOf(checkboxId), 1);
        }

        handleOnChange({ target: { name: 'tag_ids', value: updatedList } });
    };

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

            <div className="divider mt-10">Identificación</div>

            <div className="my-5">
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    type="text"
                    name="title"
                    value={data.title}
                    className="mt-1 block w-full"
                    autoComplete="title"
                    onChange={handleOnChange}
                    placeholder="Introduce el título del evento"
                />
                <InputError message={errors.title} className="mt-2" />
            </div>
            <div className="my-5">
                <InputLabel htmlFor="description" value="Descripción del Evento" className="mb-1" />
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        toolbar: getTools()
                    }}
                    data={data.description}
                    name="description"
                    value={data.description}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        handleOnChange({ target: { name: 'description', value: data } });
                    }}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="my-5">
                <InputLabel htmlFor="start" value="Fecha de inicio del Evento" />
                <DataPickerInputStart
                    start={data.start}
                    handleOnChange={handleOnChange}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.start} className="mt-2" />
            </div>

            <div className="my-5">
                <InputLabel htmlFor="end" value="Fecha de cierre del Evento" />
                <DataPickerInputEnd
                    end={data.end}
                    handleOnChange={handleOnChange}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.end} className="mt-2" />
            </div>

            {/* <div className="my-5">
                <InputLabel htmlFor="category_id" value="Category" />
                <SelectInput
                    name="category_id"
                    value={data.category_id}
                    onChange={handleOnChange}
                    className="mt-1 block w-full"
                >
                    <option defaultValue hidden>Elige una categoría</option>
                    {Object.keys(grouped_categories).map((group, index) => {
                        return (
                            <optgroup key={index} label={categories[index].name}>
                                {grouped_categories[group].map((option, index) => {
                                    return (
                                        <option key={index} value={option.id}>
                                            {option.name}
                                        </option>
                                    );
                                })}
                            </optgroup>
                        );
                    })}
                </SelectInput>

                <InputError message={errors.category_id} className="mt-2" />
            </div> */}

            <div className="divider mt-10">Tags</div>
            <div className="my-5">
                <Tags handleCheck={handleCheck} />
            </div>

            <div className="divider mt-10">Detalles para ubicar el evento</div>

            <div className="form-control">
                <label className="cursor-pointer">
                    <input type="checkbox" defaultChecked={data.is_online ? true : false} onClick={check} className="checkbox checkbox-primary" />
                    <span className="label-text ml-2">Es un evento online?</span>
                </label>
            </div>

            {
                !data.is_online ? (
                    <>
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
                    </>
                ) : (
                    <div className="my-3">
                        <InputLabel htmlFor="link" value="Web del Evento (opcional)" />
                        <TextInput
                            type="text"
                            name="link"
                            value={data.link}
                            className="mt-1 block w-full"
                            placeholder="Webinar link"
                            onChange={handleOnChange}
                        />
                        <InputError message={errors.link} className="mt-2" />
                    </div>
                )
            }

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
    );
}