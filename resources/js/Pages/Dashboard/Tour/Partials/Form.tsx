import React from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CmsRichTextEditor from '@/Components/CmsRichTextEditor';
import ImagicLoader from '@/Components/ImagicLoader';
import Categories from './Categories';
import DeleteButton from '@/Shared/DeleteButton';
import TimeInput  from '@/Components/TimeInput';
import { CurrencyInput } from 'react-currency-mask';
import WorkingHours from '@/Components/WorkingHours';
import Checkbox from "@/Components/Checkbox";
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

/** react-currency-mask typings omit className / InputElement used here */
const CurrencyInputField = CurrencyInput as unknown as React.ComponentType<Record<string, unknown>>;

export default function Form({
    handleOnChange,
    submit,
    data,
    errors,
    processing,
    onDelete = null,
    onCorte: onCorteFromParent,
}: {
    handleOnChange: (e: { target: { name: string; value: unknown; type?: string; checked?: boolean } }) => void;
    submit: (e: React.FormEvent) => void;
    data: any;
    errors: any;
    processing: boolean;
    onDelete?: (() => void) | null;
    onCorte?: (image: string) => void;
}) {
    const onCorte =
        onCorteFromParent ??
        ((image: string) => {
            handleOnChange({ target: { name: 'featured_image', value: image } });
        });

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

    const handleMoneyChange = (_event, originalValue) => {
        const n =
            typeof originalValue === 'number' && Number.isFinite(originalValue)
                ? originalValue
                : 0;
        handleOnChange({
            target: { name: 'price', value: n.toFixed(2) },
        });
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
            <Card className="mb-5 overflow-hidden">
                <CardContent className="space-y-3 p-4 sm:p-5">
                    <div className="flex justify-center">
                    {data.featured_image ? (
                        <div className="mb-1">
                            <img src={data.featured_image} alt="featured_image" className='max-h-96 w-full max-w-md rounded-xl object-contain'/>
                        </div>
                    ) : (
                        <>
                            {(data.image) && (
                                <div className="mb-1">
                                    <img src={data.image} alt="current_image" className='max-h-96 w-full max-w-md rounded-xl object-contain'/>
                                </div>
                            )}
                        </>
                    )}
                    </div>

                    <ImagicLoader onCorte={onCorte}></ImagicLoader>

                    <InputError message={errors.featured_image} className="mt-2"/>
                    <InputError message={errors.image} className="mt-2"/>
                </CardContent>
            </Card>
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
                <div className="flex min-w-0 max-w-full items-stretch">
                    <select
                        id="currency"
                        name="currency"
                        value={data.currency}
                        onChange={handleOnChange}
                        className={cn(
                            'h-10 shrink-0 rounded-l-md rounded-r-none border border-input bg-background px-3 text-sm shadow-sm',
                            'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        )}
                    >
                        <option value="UYU">UYU</option>
                        <option value="BRL">BRL</option>
                    </select>
                    <CurrencyInputField
                        className="min-w-0 flex-1"
                        currency={data.currency}
                        locale={data.currency === 'UYU' ? 'es-UY' : 'pt-BR'}
                        name="price"
                        value={data.price === '' || data.price == null ? '0' : data.price}
                        autoComplete="off"
                        InputElement={
                            <Input
                                id="price"
                                className="rounded-l-none border-l-0 shadow-sm"
                            />
                        }
                        onChangeValue={handleMoneyChange}
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
                <CmsRichTextEditor
                    id="description"
                    name="description"
                    value={data.description ?? ''}
                    onChange={handleOnChange}
                    placeholder="Descripción del tour…"
                    invalid={!!errors.description}
                    className="mt-1"
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
