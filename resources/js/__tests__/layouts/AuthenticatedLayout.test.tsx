import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

vi.mock('@/Components/ApplicationLogo', () => ({
  default: () => <span>logo</span>,
}));

vi.mock('@/Components/ThemeToggle', () => ({
  ThemeToggle: () => null,
}));

vi.mock('@/Components/ThemeProvider', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

vi.mock('@/Components/Dropdown', () => {
  const Trigger = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const Content = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const Link = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const Dropdown = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  Dropdown.Trigger = Trigger;
  Dropdown.Content = Content;
  Dropdown.Link = Link;
  return { default: Dropdown };
});

vi.mock('@/utils', () => ({
  trans: (key: string) => key,
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}));

const pageProps = vi.hoisted(() => ({
  current: {
    auth: {
      user: {
        id: 1,
        name: 'Ada',
        email: 'ada@example.com',
        is_admin: true,
        is_staff: true,
      },
    },
    flash: {},
    tracker_enabled: true,
  },
}));

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  usePage: () => ({ props: pageProps.current }),
}));

vi.mock('@/Components/NavLink', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/Components/ResponsiveNavLink', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const routeMock = Object.assign(
  (name?: string) => {
    if (name) {
      return `/${name}`;
    }

    return { current: () => false };
  },
  { current: () => false },
);

vi.stubGlobal('route', routeMock);

describe('AuthenticatedLayout nav', () => {
  it('mostra Usuarios e Insights para admin', () => {
    pageProps.current.auth.user = {
      id: 1,
      name: 'Ada',
      email: 'ada@example.com',
      is_admin: true,
      is_staff: true,
    };

    render(
      <Authenticated>
        <div>child</div>
      </Authenticated>,
    );

    expect(screen.getAllByText('Usuarios').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Insights').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Locales').length).toBeGreaterThan(0);
  });

  it('mostra CMS e esconde Usuarios/Insights para editor', () => {
    pageProps.current.auth.user = {
      id: 2,
      name: 'Ed',
      email: 'ed@example.com',
      is_admin: false,
      is_staff: true,
    };

    render(
      <Authenticated>
        <div>child</div>
      </Authenticated>,
    );

    expect(screen.getAllByText('Locales').length).toBeGreaterThan(0);
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
    expect(screen.queryByText('Insights')).not.toBeInTheDocument();
    expect(screen.queryByText('Tracker')).not.toBeInTheDocument();
  });
});
