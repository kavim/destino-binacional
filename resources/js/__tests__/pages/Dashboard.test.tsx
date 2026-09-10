import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '@/Pages/Dashboard';

vi.mock('@/Layouts/AuthenticatedLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/utils', () => ({
  trans: (key: string) => key,
}));

vi.mock('@inertiajs/react', () => ({
  Head: ({ children }: { children?: ReactNode }) => <>{children}</>,
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  usePage: () => ({
    props: {
      tracker_enabled: true,
    },
  }),
}));

vi.stubGlobal('route', (name: string) => `/${name}`);

describe('Dashboard shortcuts', () => {
  it('mostra Usuarios, Insights e Tracker para admin', () => {
    render(
      <Dashboard auth={{ user: { name: 'Ada', is_admin: true } }} />,
    );

    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Tracker')).toBeInTheDocument();
    expect(screen.getByText('Locales')).toBeInTheDocument();
    expect(screen.getByText('Actividad')).toBeInTheDocument();
  });

  it('esconde analytics e usuarios para editor', () => {
    render(
      <Dashboard auth={{ user: { name: 'Ed', is_admin: false } }} />,
    );

    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
    expect(screen.queryByText('Insights')).not.toBeInTheDocument();
    expect(screen.queryByText('Tracker')).not.toBeInTheDocument();
    expect(screen.getByText('Locales')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Tours')).toBeInTheDocument();
    expect(screen.getByText('Actividad')).toBeInTheDocument();
  });
});
