import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GalleryManager from '@/Components/GalleryManager';

describe('GalleryManager', () => {
    it('renders upload zone and empty state', () => {
        const onChange = vi.fn();
        render(<GalleryManager onChange={onChange} />);

        expect(screen.getByText(/Galería de imágenes/i)).toBeInTheDocument();
        expect(screen.getByText(/Sin imágenes en la galería/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Agregar imágenes/i })).toBeInTheDocument();
    });

    it('shows initial gallery images', () => {
        const onChange = vi.fn();
        render(
            <GalleryManager
                initialGallery={[{ id: 1, url: 'https://example.com/a.jpg', sort_order: 0 }]}
                onChange={onChange}
            />,
        );

        expect(screen.getByRole('presentation')).toHaveAttribute('src', 'https://example.com/a.jpg');
    });
});
