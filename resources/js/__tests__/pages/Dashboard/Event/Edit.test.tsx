import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';

const { mockPut, mockVisit } = vi.hoisted(() => ({
  mockPut: vi.fn(),
  mockVisit: vi.fn(),
}));

vi.mock('@/Layouts/AuthenticatedLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/Components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/Pages/Dashboard/Event/Partials/Form', () => ({
  default: ({
    data,
    onCorte,
  }: {
    data: { featured_image?: string; image?: string };
    onCorte?: (image: string) => void;
  }) => (
    <div>
      <span data-testid="featured-image">{data.featured_image ?? ''}</span>
      <span data-testid="current-image">{data.image ?? ''}</span>
      <button type="button" onClick={() => onCorte?.('data:image/webp;base64,cropped')}>
        Simular crop
      </button>
    </div>
  ),
}));

vi.mock('@inertiajs/react', () => ({
  usePage: () => ({
    props: {
      auth: {},
      event: {
        id: 64,
        title: 'Noite do Vinho',
        description: 'Descrição',
        category_id: 5,
        image: 'https://example.com/events/noite.jpg',
        start: '2026-07-01',
        end: '2026-07-02',
        is_online: false,
      },
      tag_ids: [1, 2],
    },
  }),
  useForm: (initial: Record<string, unknown>) => {
    const [data, setDataState] = useState(initial);

    const setData = (
      key: string | ((prev: typeof initial) => typeof initial),
      value?: unknown,
    ) => {
      if (typeof key === 'function') {
        setDataState(key);
        return;
      }
      setDataState((prev) => ({ ...prev, [key]: value }));
    };

    return {
      data,
      setData,
      errors: {},
      put: mockPut,
      processing: false,
    };
  },
  router: {
    visit: mockVisit,
  },
}));

vi.stubGlobal('route', (name: string, id?: number) =>
  id != null ? `/${name}/${id}` : `/${name}`,
);

import Edit from '@/Pages/Dashboard/Event/Edit';

describe('Dashboard Event Edit', () => {
  beforeEach(() => {
    mockPut.mockClear();
    mockVisit.mockClear();
  });

  it('inicializa image com URL do evento e featured_image vazio', () => {
    render(<Edit />);

    expect(screen.getByTestId('current-image').textContent).toBe(
      'https://example.com/events/noite.jpg',
    );
    expect(screen.getByTestId('featured-image').textContent).toBe('');
  });

  it('onCorte define featured_image e limpa image', () => {
    render(<Edit />);

    fireEvent.click(screen.getByRole('button', { name: 'Simular crop' }));

    expect(screen.getByTestId('featured-image').textContent).toBe(
      'data:image/webp;base64,cropped',
    );
    expect(screen.getByTestId('current-image').textContent).toBe('');
  });
});
