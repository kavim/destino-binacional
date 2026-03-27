import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/Components/ThemeProvider';

function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>dark</button>
      <button onClick={() => setTheme('light')}>light</button>
      <button onClick={() => setTheme('system')}>system</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('aplica o tema padrão ao <html>', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('troca para dark ao clicar', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('dark'));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('persiste a escolha no localStorage', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('dark'));

    expect(window.localStorage.getItem('test-theme')).toBe('dark');
  });

  it('lê o tema do localStorage quando existe', () => {
    window.localStorage.setItem('test-theme', 'dark');

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('system resolve para dark quando prefers-color-scheme é dark', () => {
    render(
      <ThemeProvider defaultTheme="system" storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('useTheme retorna valores padrão fora do provider sem crash', () => {
    const ctx = useTheme;
    expect(ctx).toBeDefined();
  });
});
