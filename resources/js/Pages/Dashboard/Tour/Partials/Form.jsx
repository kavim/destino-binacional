import React from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImagicLoader from '@/Components/ImagicLoader';
import Categories from './Categories';
import DeleteButton from '@/Shared/DeleteButton';
import TimeInput  from '@/Components/TimeInput';
import { CurrencyInput } from 'react-currency-mask';
import WorkingHours from '@/Components/WorkingHours';
import Checkbox from "@/Components/Checkbox";

export default function Form({handleOnChange, submit, data, errors, processing, onDelete = null}) {
    const onCorte = (image) => {
        handleOnChange({target: {name: 'featured_image', value: image}});
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

    const startDataChange = (date) => {
        console.log(date.target.value);

        // Extrair os componentes da data
        const [year, month, day] = date.target.value.split('T')[0].split('-');
        const [hours, minutes] = date.target.value.split('T')[1].split(':');

        // Criar uma nova data no formato UTC
        const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        // Formatar a data em "yyyy-MM-ddThh:mm"
        const formattedDate = utcDate.toISOString().slice(0, 16);

        // Atualizar o estado
        handleOnChange({target: {name: 'start', value: formattedDate}});
    };

    const endDataChange = (date) => {
        // Extrair os componentes da data
        const [year, month, day] = date.target.value.split('T')[0].split('-');
        const [hours, minutes] = date.target.value.split('T')[1].split(':');

        // Criar uma nova data no formato UTC
        const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        // Formatar a data em "yyyy-MM-ddThh:mm"
        const formattedDate = utcDate.toISOString().slice(0, 16);

        // Atualizar o estado
        handleOnChange({target: {name: 'end', value: formattedDate}});
    };

    const handleMoneyChange = (event, originalValue, maskedValue) => {
        handleOnChange({target: {name: 'price', value: maskedValue}});
    };

    const handleCheck = (event) => {
        let updatedList = [...data.category_ids];
        let checkboxId = parseInt(event.target.value);

        if (event.target.checked) {
            updatedList = [...data.category_ids, checkboxId];
        } else {
            updatedList.splice(data.category_ids.indexOf(checkboxId), 1);
        }

        handleOnChange({target: {name: 'category_ids', value: updatedList}});
    };

    return (
        <form onSubmit={submit}>
            <div className='mb-5 bg-stone-200 rounded-2xl p-2'>
                <div className='flex justify-center'>
                    {data.featured_image ? (
                        <div className="mb-3">
                            <img src={data.featured_image} alt="featured_image" className='w-96 rounded-2xl'/>
                        </div>
                    ) : (
                        <>
                            {(data.image) && (
                                <div className="mb-3">
                                    <img src={data.image} alt="current_image" className='w-96 rounded-2xl'/>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <ImagicLoader onCorte={onCorte}></ImagicLoader>

                <InputError message={errors.featured_image} className="mt-2"/>
                <InputError message={errors.image} className="mt-2"/>
            </div>
            <div className="my-5">
                <InputLabel htmlFor="title" value="Titulo"/>
                <TextInput
                    type="text"
                    name="title"
                    value={data.title}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    onChange={handleOnChange}
                />
                <InputError message={errors.title} className="mt-2"/>
            </div>
            <div className="my-5">
                <InputLabel htmlFor="price" value="Price"/>
                <div className="flex items-center space-x-2">
                    <select
                        value={data.currency}
                        onChange={handleOnChange}
                        className="border border-gray-300 rounded-l-md"
                        name="currency"
                    >
                        <option defaultValue={data.currency} value="UYU">UYU</option>
                        <option defaultValue={data.currency} value="BRL">BRL</option>
                    </select>
                    <CurrencyInput
                        currency={data.currency}
                        name="price"
                        value={data.price || '00'}
                        className="border border-gray-300 w-full ml-0 rounded-r-md"
                        autoComplete="price"
                        onChangeValue={(event, originalValue, maskedValue) => {
                          handleMoneyChange(event, originalValue, maskedValue);
                        }}
                    />
                </div>
                <InputError message={errors.price} className="mt-2"/>
            </div>

            <div className="my-5">
                <InputLabel htmlFor="guide" value="Nombre del Guia turistico"/>
                <TextInput
                    type="text"
                    name="guide"
                    value={data.guide}
                    className="mt-1 block w-full"
                    autoComplete="guide"
                    onChange={handleOnChange}
                />
                <InputError message={errors.guide} className="mt-2"/>
            </div>
            <div className="my-3">
                <InputLabel htmlFor="description" value="Descripción en Español"/>
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        toolbar: getTools()
                    }}
                    data={data.description || "<p>Descripción</p>"}
                    name="description"
                    value={data.description}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        handleOnChange({target: {name: 'description', value: data}});
                    }}
                />
                <InputError message={errors.description} className="mt-2"/>
            </div>
            <div className="my-3">
                <InputLabel htmlFor="google_maps_src" value="Google Maps link"/>
                <TextInput
                    type="text"
                    name="google_maps_src"
                    value={data.google_maps_src}
                    className="mt-1 block w-full"
                    onChange={handleOnChange}
                />
                <InputError message={errors.google_maps_src} className="mt-2"/>
            </div>
            <div className="my-3">
                <InputLabel htmlFor="address" value="Dirección | Punto de encuentro"/>
                <TextInput
                    type="text"
                    name="meeting_point"
                    value={data.meeting_point}
                    className="mt-1 block w-full"
                    placeholder="Punto de encuentro"
                    onChange={handleOnChange}
                />
                <InputError message={errors.meeting_point} className="mt-2"/>
            </div>

            <div className="divider mt-10">Recorrencia</div>

            <div className="my-5">
                <Checkbox label="Ativar recorrencia" name="recurrence_enabled" isChecked={data.recurrence_enabled} onChange={handleOnChange} />

                {data.recurrence_enabled ? (
                    <WorkingHours workingHours={data.recurrence_day_hour} handleOnChange={handleOnChange} />
                ) : (
                    <div>
                        <div className="my-5">
                            <InputLabel htmlFor="start" value="Fecha de inicio"/>
                            <TimeInput value={data.start} onChange={startDataChange}></TimeInput>
                            <InputError message={errors.start} className="mt-2"/>
                        </div>
                        <div className="my-5">
                            <InputLabel htmlFor="end" value="Fecha de cierre"/>
                            <TimeInput value={data.end} onChange={endDataChange}></TimeInput>
                            <InputError message={errors.end} className="mt-2"/>
                        </div>
                    </div>
                )}
            </div>

            <div className="divider mt-10">Categorias</div>
            <div className="my-5">
                <Categories handleCheck={handleCheck}/>
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
