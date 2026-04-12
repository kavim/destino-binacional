import { useState, useEffect } from "react";
import type React from "react";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ImagicLoader from "@/Components/ImagicLoader";
import DeleteButton from "@/Shared/DeleteButton";
import { Card, CardContent } from "@/Components/ui/card";

export type CategoryParentSummary = {
    id: number;
    name: string;
    color: string;
    icon: string;
};

type CategoryFormData = {
    name_es: string;
    name_pt: string;
    icon: string;
    /** Resolved icon URL (edit screen preview only; not submitted as canonical storage). */
    icon_preview_url?: string;
    icon_image: string | File;
    featured_image: string;
    image: string;
    color: string;
    parent_id: number | null;
};

type CategoryFormErrors = Record<string, string | undefined>;

type CategoryOnChangePayload = {
    target: { name: string; value: unknown; type?: string; checked?: boolean };
};

type FormProps = {
    handleOnChange: (e: CategoryOnChangePayload | React.ChangeEvent<HTMLInputElement>) => void;
    submit: (e: React.FormEvent) => void;
    data: CategoryFormData;
    errors: CategoryFormErrors;
    onDelete?: () => void;
    parent?: CategoryParentSummary | null;
    processing: boolean;
    onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Form({
    handleOnChange,
    submit,
    data,
    errors,
    onDelete = undefined,
    parent = null,
    processing,
    onIconChange,
}: FormProps) {
    const [iconImage, setIconImage] = useState<string | null>(null);

    const onCorte = (image: string) => {
        handleOnChange({ target: { name: "image", value: image } });
    };

    const onIconImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIconImage(URL.createObjectURL(file));
        }
        onIconChange(event);
    };

    useEffect(() => {
        const preview = data.icon_preview_url?.trim();
        if (preview) {
            setIconImage(preview);
            return;
        }
        const raw = data.icon?.trim();
        if (!raw) {
            return;
        }
        if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
            setIconImage(raw);
            return;
        }
        setIconImage(raw.startsWith("icons/") ? `/images/${raw}` : `/images/icons/${raw}`);
    }, [data.icon, data.icon_preview_url]);

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
                        <Card className="mb-5 overflow-hidden">
                            <CardContent className="space-y-3 p-4 sm:p-5">
                                <div className="flex justify-center">
                                    {data.featured_image && !data.image ? (
                                        <div className="mb-1">
                                            <img
                                                src={data.featured_image}
                                                alt="featured_image"
                                                className="max-h-96 w-full max-w-md rounded-xl object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {data.image && (
                                                <div className="mb-1">
                                                    <img
                                                        src={data.image}
                                                        alt="current_image"
                                                        className="max-h-96 w-full max-w-md rounded-xl object-contain"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <ImagicLoader onCorte={onCorte}></ImagicLoader>

                                <InputError
                                    message={errors.featured_image}
                                    className="mt-2"
                                />
                                <InputError message={errors.image} className="mt-2" />
                            </CardContent>
                        </Card>
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
                                    <div className="my-2 flex items-center justify-start">
                                        <div
                                            className="rounded-full p-2"
                                            style={{ backgroundColor: data.color }}
                                        >
                                            <img
                                                src={iconImage}
                                                alt="icon"
                                                className="h-10 w-10 rounded-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    name="icon_image"
                                    onChange={onIconImageChange}
                                />

                                <div className="my-5 rounded-md border p-2">
                                    <p>
                                        Recomendamos descargar los iconos SVG{" "}
                                        <a
                                            href="https://www.svgrepo.com/"
                                            className="text-primary underline underline-offset-2 hover:text-primary/80"
                                        >
                                            de este catálogo
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {onDelete ? (
                    <div className="mt-5 flex justify-between">
                        <DeleteButton type="button" onDelete={onDelete}>
                            Delete
                        </DeleteButton>
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    </div>
                ) : (
                    <div className="mt-5 flex justify-end">
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    </div>
                )}
            </form>
        </>
    );
}
