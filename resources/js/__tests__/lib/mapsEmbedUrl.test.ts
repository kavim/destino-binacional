import { describe, expect, it } from 'vitest';
import {
    googleMapsOpenUrl,
    googleMapsSearchUrl,
    normalizeGoogleMapsEmbedSrc,
    safeGoogleMapsEmbedUrl,
} from '@/lib/mapsEmbedUrl';

describe('mapsEmbedUrl', () => {
    it('safeGoogleMapsEmbedUrl accepts google embed https', () => {
        const u =
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d-55!3d-30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s';
        expect(safeGoogleMapsEmbedUrl(u)).toBe(u);
    });

    it('normalizeGoogleMapsEmbedSrc maps share link with pb becomes embed', () => {
        const share =
            'https://www.google.com/maps?pb=!1m18!1m12!1m3!1d1!2d-55!3d-30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s';
        expect(normalizeGoogleMapsEmbedSrc(share)).toBe(
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d-55!3d-30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s',
        );
    });

    it('googleMapsOpenUrl copies pb query to /maps', () => {
        const embed =
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d-55!3d-30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s';
        expect(googleMapsOpenUrl(embed)).toBe(
            'https://www.google.com/maps?pb=!1m18!1m12!1m3!1d1!2d-55!3d-30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s',
        );
    });

    it('googleMapsOpenUrl uses search when no embed but has address', () => {
        expect(googleMapsOpenUrl(null, 'Plaza Internacional, Rivera')).toBe(
            googleMapsSearchUrl('Plaza Internacional, Rivera'),
        );
    });
});
