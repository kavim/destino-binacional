import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ImageGallery from '@/Components/site/ImageGallery';
import { STORY_DURATION_MS } from '@/Components/site/useStoryGallery';

const images = [
    { id: 1, url: 'https://example.com/1.jpg' },
    { id: 2, url: 'https://example.com/2.jpg' },
    { id: 3, url: 'https://example.com/3.jpg' },
];

function mockMatchMedia(reducedMotion: boolean) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: query.includes('prefers-reduced-motion')
                ? reducedMotion
                : query.includes('dark'),
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}

beforeEach(() => {
    mockMatchMedia(false);
    class IntersectionObserverMock {
        observe = vi.fn();
        disconnect = vi.fn();
        unobserve = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe('ImageGallery', () => {
    it('returns null when there are no images', () => {
        const { container } = render(<ImageGallery images={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders one progress bar per image', () => {
        const { container } = render(<ImageGallery images={images} />);
        const bars = container.querySelectorAll('.rounded-full.bg-white\\/30');
        expect(bars).toHaveLength(3);
        expect(screen.getByRole('region', { name: 'Galería de imágenes' })).toBeInTheDocument();
        expect(screen.getByText('1/3')).toBeInTheDocument();
    });

    it('advances to the next slide when tapping the right side', () => {
        const { container } = render(<ImageGallery images={images} />);
        const viewer = container.querySelector('[aria-roledescription="carousel"]');
        expect(viewer).not.toBeNull();

        Object.defineProperty(viewer!, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                width: 300,
                height: 500,
                top: 0,
                left: 0,
                right: 300,
                bottom: 500,
                toJSON: () => ({}),
            }),
        });

        fireEvent.click(viewer!, { clientX: 250 });
        expect(screen.getByText('2/3')).toBeInTheDocument();
    });

    it('auto-advances after the story duration', () => {
        vi.useFakeTimers();
        render(<ImageGallery images={images} />);

        expect(screen.getByText('1/3')).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(STORY_DURATION_MS + 100);
        });
        expect(screen.getByText('2/3')).toBeInTheDocument();
    });

    it('does not auto-advance when reduced motion is preferred', () => {
        mockMatchMedia(true);
        vi.useFakeTimers();
        render(<ImageGallery images={images} />);

        vi.advanceTimersByTime(STORY_DURATION_MS + 100);
        expect(screen.getByText('1/3')).toBeInTheDocument();
    });

    it('shows desktop thumbnail buttons for quick navigation', () => {
        render(<ImageGallery images={images} />);
        fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 3' }));
        expect(screen.getByText('3/3')).toBeInTheDocument();
    });
});
