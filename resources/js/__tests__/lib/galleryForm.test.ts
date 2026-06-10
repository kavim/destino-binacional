import { describe, expect, it } from 'vitest';
import {
    createGalleryState,
    galleryHasNewFiles,
    galleryOrderTokens,
} from '@/lib/galleryForm';

describe('galleryForm', () => {
    it('builds order tokens for existing and new items', () => {
        const state = createGalleryState([{ id: 5, url: 'https://example.com/a.jpg' }]);
        state.items.push({
            kind: 'new',
            tempId: 'tmp-abc',
            previewUrl: 'blob:preview',
            file: new File(['x'], 'x.jpg', { type: 'image/jpeg' }),
        });

        expect(galleryOrderTokens(state)).toEqual(['existing:5', 'new:tmp-abc']);
        expect(galleryHasNewFiles(state)).toBe(true);
    });

    it('detects when no new files are present', () => {
        const state = createGalleryState([{ id: 1, url: 'https://example.com/a.jpg' }]);
        expect(galleryHasNewFiles(state)).toBe(false);
    });
});
