import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/Components/ui/input';

describe('Input', () => {
  it('renderiza como elemento input', () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId('input').tagName).toBe('INPUT');
  });

  it('aceita tipo email', () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
  });

  it('aplica placeholder corretamente', () => {
    render(<Input placeholder="Buscar..." data-testid="input" />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('pode ser desabilitado', () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId('input')).toBeDisabled();
  });

  it('usa border-input para token semântico', () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId('input').className).toContain('border-input');
  });

  it('possui classes de dark mode', () => {
    render(<Input data-testid="input" />);
    const cls = screen.getByTestId('input').className;
    expect(cls).toContain('dark:');
  });
});
