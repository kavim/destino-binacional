import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainNav from '@/Components/MainNav';

vi.mock('@/Components/ThemeToggle', () => ({
  ThemeToggle: () => null,
}));

vi.mock('@/Components/Flags', () => ({
  default: () => null,
}));

vi.mock('@/Components/MobileNav', () => ({
  default: () => <div>mobile-nav</div>,
}));

vi.mock('@/Components/ApplicationLogo', () => ({
  default: () => <span>logo</span>,
}));

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePage: () => ({
    props: {
      cats: {
        categories: [{ slug: 'cultura', color: '#6366f1', icon: '/icon.svg', name: 'Cultura' }],
      },
    },
  }),
}));

vi.stubGlobal('route', (name: string) => `/${name}`);

describe('MainNav', () => {
  beforeEach(() => {
    window._translations = {
      'nav.categories': 'Categorias',
      'nav.open_menu': 'Abrir menu',
      'nav.close_menu': 'Fechar menu',
    };
  });

  it('expande e recolhe categorias com clique, Enter e Escape', async () => {
    const user = userEvent.setup();
    render(<MainNav />);

    const trigger = screen.getByRole('button', { name: 'Categorias' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.queryByRole('link', { name: /Cultura/ })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Cultura/ })).toBeVisible();

    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('tem aria-label no botão hamburger', () => {
    render(<MainNav />);
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument();
  });
});
