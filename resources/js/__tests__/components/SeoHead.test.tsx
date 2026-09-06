import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import SeoHead from '@/Components/SeoHead';

vi.mock('@inertiajs/react', () => ({
  Head: ({ title, children }: { title?: string; children?: ReactNode }) => (
    <div data-testid="head" data-title={title}>
      {children}
    </div>
  ),
  usePage: () => ({
    url: '/p/plaza',
    props: {
      ziggy: {
        location: 'https://destinobinacional.com/p/plaza',
        url: 'https://destinobinacional.com',
      },
    },
  }),
}));

describe('SeoHead', () => {
  beforeEach(() => {
    window._translations = {
      'seo.fallback': 'Destino Binacional',
    };
  });

  it('envia description e Open Graph', () => {
    const { getByTestId, container } = render(
      <SeoHead title="Plaza" description="Praça na fronteira" image="/storage/places/a.jpg" />,
    );

    expect(getByTestId('head')).toHaveAttribute('data-title', 'Plaza');
    expect(container.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Praça na fronteira',
    );
    expect(container.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Plaza');
    expect(container.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Praça na fronteira',
    );
    expect(container.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://destinobinacional.com/storage/places/a.jpg',
    );
    expect(container.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://destinobinacional.com/p/plaza',
    );
  });
});
