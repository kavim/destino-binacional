import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { GripVertical, Trash2, Images } from 'lucide-react';
import {
    createGalleryState,
    type GalleryImageDto,
    type GalleryItem,
    type GalleryState,
} from '@/lib/galleryForm';

type GalleryManagerProps = {
    initialGallery?: GalleryImageDto[];
    onChange: (state: GalleryState) => void;
};

function createTempId(): string {
    return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function GalleryManager({ initialGallery = [], onChange }: GalleryManagerProps) {
    const [items, setItems] = useState<GalleryItem[]>(() =>
        createGalleryState(initialGallery).items,
    );
    const [removeIds, setRemoveIds] = useState<number[]>([]);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        onChange({ items, removeIds });
    }, [items, removeIds, onChange]);

    const addFiles = (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const newItems: GalleryItem[] = fileArray.map((file) => ({
            kind: 'new',
            tempId: createTempId(),
            previewUrl: URL.createObjectURL(file),
            file,
        }));

        setItems((prev) => [...prev, ...newItems]);
    };

    const onFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            addFiles(event.target.files);
            event.target.value = '';
        }
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const dropped = event.dataTransfer.files;
        if (dropped.length > 0) {
            addFiles(dropped);
        }
    };

    const removeItem = (index: number) => {
        setItems((prev) => {
            const target = prev[index];
            if (target?.kind === 'existing') {
                setRemoveIds((ids) => [...ids, target.id]);
            }
            if (target?.kind === 'new') {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const moveItem = (from: number, to: number) => {
        if (from === to || to < 0 || to >= items.length) {
            return;
        }

        setItems((prev) => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });
    };

    const previewUrl = (item: GalleryItem): string =>
        item.kind === 'existing' ? item.url : item.previewUrl;

    return (
        <Card className="mb-5 overflow-hidden">
            <CardContent className="space-y-4 p-4 sm:p-5">
                <div className="flex items-center gap-2">
                    <Images className="h-5 w-5 text-muted-foreground" aria-hidden />
                    <h3 className="text-sm font-semibold text-foreground">Galería de imágenes</h3>
                </div>

                <div
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                >
                    <p className="mb-3 text-sm text-muted-foreground">
                        Arrastra imágenes aquí o selecciona varias a la vez
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={onFileInput}
                    />
                    <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                        Agregar imágenes
                    </Button>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {items.map((item, index) => (
                            <div
                                key={item.kind === 'existing' ? `existing-${item.id}` : item.tempId}
                                draggable
                                onDragStart={() => setDragIndex(index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                    if (dragIndex !== null) {
                                        moveItem(dragIndex, index);
                                        setDragIndex(null);
                                    }
                                }}
                                className="group relative overflow-hidden rounded-lg border border-border bg-card"
                            >
                                <img
                                    src={previewUrl(item)}
                                    alt=""
                                    className="aspect-[4/3] w-full object-cover"
                                />
                                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/45 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <GripVertical className="h-4 w-4 text-white" aria-hidden />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="rounded p-1 text-white hover:bg-white/20"
                                        aria-label="Eliminar imagen"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-xs text-muted-foreground">
                        Sin imágenes en la galería.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
