import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Events from '@/Pages/Site/Home/Events';

const groupedEvents = {
    '2026-09-10': [
        {
            slug: 'festa-a',
            image: '/images/a.jpg',
            title: 'Festa A',
            start: '2026-09-10T20:00:00',
            end: '2026-09-10T23:00:00',
        },
    ],
    '2026-09-12': [
        {
            slug: 'festa-b',
            image: '/images/b.jpg',
            title: 'Festa B',
            start: '2026-09-12T18:00:00',
            end: '2026-09-12T22:00:00',
        },
    ],
};

vi.mock('@/utils', () => ({
    trans: (key: string) => key,
}));

vi.mock('@inertiajs/react', () => ({
    Link: ({
        href,
        children,
        onClick,
        ...rest
    }: {
        href: string;
        children: ReactNode;
        onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    }) => (
        <a href={href} onClick={onClick} {...rest}>
            {children}
        </a>
    ),
    router: { get: vi.fn() },
    usePage: () => ({
        props: {
            grouped_events: groupedEvents,
        },
    }),
}));

vi.stubGlobal('route', (name: string, param?: string) =>
    param ? `/${name}/${param}` : `/${name}`,
);

function swipe(
    element: Element,
    from: { x: number; y: number },
    to: { x: number; y: number },
) {
    fireEvent.touchStart(element, {
        touches: [{ clientX: from.x, clientY: from.y }],
    });
    fireEvent.touchEnd(element, {
        changedTouches: [{ clientX: to.x, clientY: to.y }],
    });
}

describe('Home Events carousel', () => {
    it('usa altura e largura de card que cabem no mobile', () => {
        const { container } = render(<Events />);
        const stage = container.querySelector('[aria-roledescription="carousel"]');
        expect(stage).toHaveClass('h-[min(27rem,100vw)]');
        expect(container.querySelector('a.w-\\[min\\(20rem\\,75vw\\)\\]')).not.toBeNull();
    });

    it('avança no swipe horizontal e ignora gesto vertical', () => {
        const { container } = render(<Events />);
        const stage = container.querySelector('[aria-roledescription="carousel"]');
        expect(stage).not.toBeNull();
        expect(screen.getByRole('heading', { name: 'Festa A' })).toBeInTheDocument();

        swipe(stage!, { x: 200, y: 80 }, { x: 180, y: 200 });
        expect(screen.getByRole('heading', { name: 'Festa A' })).toBeInTheDocument();

        swipe(stage!, { x: 220, y: 90 }, { x: 40, y: 95 });
        expect(screen.getByRole('heading', { name: 'Festa B' })).toBeInTheDocument();
    });

    it('não segue o link do card depois de um swipe', () => {
        const { container } = render(<Events />);
        const stage = container.querySelector('[aria-roledescription="carousel"]');
        const card = container.querySelector('a[href="/site.events.show/festa-a"]');
        expect(stage).not.toBeNull();
        expect(card).not.toBeNull();

        swipe(stage!, { x: 220, y: 90 }, { x: 40, y: 95 });
        expect(fireEvent.click(card!)).toBe(false);
    });
});
