import React from 'react';
import { usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Shared/SelectInput';
import InputError from '@/Components/InputError';
import CmsRichTextEditor from '@/Components/CmsRichTextEditor';
import ImagicLoader from '@/Components/ImagicLoader';
import Categories from './Categories';
import DeleteButton from '@/Shared/DeleteButton';
import { Card, CardContent } from '@/Components/ui/card';

type PlaceFormData = {
    name: string;
    description_es?: string;
    description_pt?: string;
    featured_image?: string;
    image?: string;
    google_maps_src?: string;
    address?: string;
    city_id?: string | number;
    place_type_id?: string | number;
    order?: string | number;
    category_ids: number[];
};

type PlaceFormErrors = Record<string, string | undefined>;

export type FormChangeEvent = {
    target: { name: string; value: unknown; type?: string; checked?: boolean };
};

export default function Form({
    handleOnChange,
    submit,
    data,
    errors,
    processing,
    onDelete = null,
    onCorte: onCorteFromParent,
}: {
    handleOnChange: (e: FormChangeEvent | React.ChangeEvent<HTMLInputElement>) => void;
    submit: (e: React.FormEvent) => void;
    data: PlaceFormData;
    errors: PlaceFormErrors;
    processing: boolean;
    onDelete?: (() => void) | null;
    onCorte?: (image: string) => void;
}) {
    const { cities, place_types } = usePage().props as unknown as {
        cities: Record<string, { id: string | number; name: string }>;
        place_types: Record<string, { id: string | number; name: string }>;
    };

    const onCorte =
        onCorteFromParent ??
        ((image: string) => {
            handleOnChange({ target: { name: 'featured_image', value: image } });
        });

    const handleCheck = (event: {
        target: { value?: string | number; checked: boolean };
    }) => {
        let updatedList = [...data.category_ids];
        if (event.target.value === undefined) return;
        const checkboxId = parseInt(String(event.target.value), 10);

        if (event.target.checked) {
            updatedList = [...data.category_ids, checkboxId];
        } else {
            updatedList.splice(data.category_ids.indexOf(checkboxId), 1);
        }

        handleOnChange({ target: { name: 'category_ids', value: updatedList } });
    };

    return (
        <form onSubmit={submit}>
            <Card className="mb-5 overflow-hidden">
                <CardContent className="space-y-3 p-4 sm:p-5">
                    <div className="flex justify-center">
                    {data.featured_image ? (
                        <div className="mb-1">
                            <img src={data.featured_image} alt="featured_image" className='max-h-96 w-full max-w-md rounded-xl object-contain' />
                        </div>
                    ) : (
                        <>
                            {(data.image) && (
                                <div className="mb-1">
                                    <img src={data.image} alt="current_image" className='max-h-96 w-full max-w-md rounded-xl object-contain' />
                                </div>
                            )}
                        </>
                    )}
                    </div>

                    <ImagicLoader onCorte={onCorte}></ImagicLoader>

                    <InputError message={errors.featured_image} className="mt-2" />
                    <InputError message={errors.image} className="mt-2" />
                </CardContent>
            </Card>
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
                <CmsRichTextEditor
                    id="description_es"
                    name="description_es"
                    value={data.description_es ?? ''}
                    onChange={handleOnChange}
                    placeholder="Descripción en español…"
                    invalid={!!errors.description_es}
                    className="mt-1"
                />
                <InputError message={errors.description_es} className="mt-2" />
            </div>
            <div className="my-3">
                <InputLabel htmlFor="description_pt" value="Descripción en Portugués" />
                <CmsRichTextEditor
                    id="description_pt"
                    name="description_pt"
                    value={data.description_pt ?? ''}
                    onChange={handleOnChange}
                    placeholder="Descrição em português…"
                    invalid={!!errors.description_pt}
                    className="mt-1"
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
                    <option value="" disabled hidden>
                        Elige una Ciudad
                    </option>
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
                    <option value="" disabled hidden>
                        Elija una opción
                    </option>
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