import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@inertiajs/react', () => ({
  usePage: () => ({
    props: {
      cities: {
        '1': { id: 1, name: 'Rivera' },
      },
    },
  }),
}));

vi.mock('@/Components/InputLabel', () => ({
  default: ({ value }: { value: string }) => <label>{value}</label>,
}));

vi.mock('@/Components/PrimaryButton', () => ({
  default: ({ children }: { children: React.ReactNode }) => <button type="submit">{children}</button>,
}));

vi.mock('@/Components/TextInput', () => ({
  default: () => <input />,
}));

vi.mock('@/Shared/SelectInput', () => ({
  default: () => <select />,
}));

vi.mock('@/Components/InputError', () => ({
  default: () => null,
}));

vi.mock('@/Components/CmsRichTextEditor', () => ({
  default: () => <textarea />,
}));

vi.mock('@/Components/ImagicLoader', () => ({
  default: () => <div data-testid="imagic-loader" />,
}));

vi.mock('@/Components/GalleryManager', () => ({
  default: () => <div data-testid="gallery-manager" />,
}));

vi.mock('@/Shared/DataPickerInputStart', () => ({
  default: () => <input />,
}));

vi.mock('@/Shared/DataPickerInputEnd', () => ({
  default: () => <input />,
}));

vi.mock('@/Shared/DeleteButton', () => ({
  default: () => null,
}));

vi.mock('@/Pages/Dashboard/Event/Partials/Tags', () => ({
  default: () => null,
}));

vi.mock('@/Components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import Form from '@/Pages/Dashboard/Event/Partials/Form';

const baseProps = {
  handleOnChange: vi.fn(),
  submit: vi.fn((e: React.FormEvent) => e.preventDefault()),
  errors: {},
  processing: false,
};

describe('Event Form image preview', () => {
  it('mostra data.image quando featured_image está vazio', () => {
    render(
      <Form
        {...baseProps}
        data={{
          title: 'Evento',
          is_online: false,
          tag_ids: [],
          image: 'https://example.com/events/current.jpg',
          featured_image: '',
        }}
      />,
    );

    const img = screen.getByAltText('current_image');
    expect(img).toHaveAttribute('src', 'https://example.com/events/current.jpg');
  });

  it('mostra data.featured_image quando crop foi feito', () => {
    render(
      <Form
        {...baseProps}
        data={{
          title: 'Evento',
          is_online: false,
          tag_ids: [],
          image: '',
          featured_image: 'data:image/webp;base64,newcrop',
        }}
      />,
    );

    const img = screen.getByAltText('featured_image');
    expect(img).toHaveAttribute('src', 'data:image/webp;base64,newcrop');
    expect(screen.queryByAltText('current_image')).not.toBeInTheDocument();
  });
});
