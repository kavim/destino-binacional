import { describe, expect, it } from 'vitest';
import {
    isLongCmsDescription,
    LONG_CMS_DESCRIPTION_MIN_CHARS,
} from '@/lib/cmsDescriptionLength';

describe('isLongCmsDescription', () => {
    it('returns false for empty or short text', () => {
        expect(isLongCmsDescription('')).toBe(false);
        expect(isLongCmsDescription('<p>Breve.</p>')).toBe(false);
    });

    it('ignores HTML markup when measuring length', () => {
        const text = 'a'.repeat(LONG_CMS_DESCRIPTION_MIN_CHARS);
        expect(isLongCmsDescription(`<p><strong>${text}</strong></p>`)).toBe(true);
    });

    it('returns true at or above the threshold', () => {
        const text = 'x'.repeat(LONG_CMS_DESCRIPTION_MIN_CHARS);
        expect(isLongCmsDescription(`<p>${text}</p>`)).toBe(true);
    });
});
