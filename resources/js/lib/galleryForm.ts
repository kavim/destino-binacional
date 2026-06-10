import { router } from '@inertiajs/react';

export type ExistingGalleryItem = {
    kind: 'existing';
    id: number;
    url: string;
};

export type NewGalleryItem = {
    kind: 'new';
    tempId: string;
    previewUrl: string;
    file: File;
};

export type GalleryItem = ExistingGalleryItem | NewGalleryItem;

export type GalleryState = {
    items: GalleryItem[];
    removeIds: number[];
};

export type GalleryImageDto = {
    id: number;
    url: string;
    sort_order?: number;
};

export function createGalleryState(initial: GalleryImageDto[] = []): GalleryState {
    return {
        items: initial.map((image) => ({
            kind: 'existing' as const,
            id: image.id,
            url: image.url,
        })),
        removeIds: [],
    };
}

export function galleryHasNewFiles(state: GalleryState): boolean {
    return state.items.some((item) => item.kind === 'new');
}

export function galleryOrderTokens(state: GalleryState): string[] {
    return state.items.map((item) =>
        item.kind === 'existing' ? `existing:${item.id}` : `new:${item.tempId}`,
    );
}

function appendScalar(formData: FormData, key: string, value: unknown): void {
    if (value === null || value === undefined) {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((entry) => {
            formData.append(`${key}[]`, String(entry));
        });
        return;
    }

    if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
        return;
    }

    if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
            appendNested(formData, `${key}[${childKey}]`, childValue);
        });
        return;
    }

    formData.append(key, String(value));
}

function appendNested(formData: FormData, key: string, value: unknown): void {
    if (value === null || value === undefined) {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((entry, index) => {
            appendNested(formData, `${key}[${index}]`, entry);
        });
        return;
    }

    if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
            appendNested(formData, `${key}[${childKey}]`, childValue);
        });
        return;
    }

    if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
        return;
    }

    formData.append(key, String(value));
}

export function appendGalleryFields(formData: FormData, state: GalleryState): void {
    formData.append('gallery_order', JSON.stringify(galleryOrderTokens(state)));

    state.removeIds.forEach((id) => {
        formData.append('gallery_remove_ids[]', String(id));
    });

    const newItems = state.items.filter((item): item is NewGalleryItem => item.kind === 'new');
    newItems.forEach((item, index) => {
        formData.append('gallery_new[]', item.file);
        formData.append(`gallery_new_keys[${index}]`, item.tempId);
    });
}

export function appendEntityFormData(formData: FormData, data: Record<string, unknown>): void {
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && (value === '' || value === null || value === undefined)) {
            return;
        }

        if (value === null || value === undefined) {
            return;
        }

        if (key === 'recurrence_day_hour' || (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object')) {
            appendNested(formData, key, value);
            return;
        }

        appendScalar(formData, key, value);
    });
}

type SubmitOptions = {
    preserveScroll?: boolean;
    onError?: () => void;
};

export function submitEntityWithGallery(
    url: string,
    method: 'post' | 'put',
    data: Record<string, unknown>,
    galleryState: GalleryState,
    options: SubmitOptions = {},
): void {
    const needsFormData = galleryHasNewFiles(galleryState);

    if (!needsFormData) {
        const payload = {
            ...data,
            gallery_order: JSON.stringify(galleryOrderTokens(galleryState)),
            gallery_remove_ids: galleryState.removeIds,
        };

        if (method === 'put') {
            router.put(url, payload, options);
        } else {
            router.post(url, payload, options);
        }
        return;
    }

    const formData = new FormData();
    appendEntityFormData(formData, data);
    appendGalleryFields(formData, galleryState);

    if (method === 'put') {
        formData.append('_method', 'PUT');
    }

    router.post(url, formData, {
        ...options,
        forceFormData: true,
    });
}
