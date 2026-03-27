import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrimaryButton from '@/Components/PrimaryButton';

describe('PrimaryButton', () => {
  it('renderiza um botão com texto', () => {
    render(<PrimaryButton>Salvar</PrimaryButton>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('usa variante default (bg-primary)', () => {
    render(<PrimaryButton>Go</PrimaryButton>);
    expect(screen.getByRole('button').className).toContain('bg-primary');
  });

  it('pode ser desabilitado', () => {
    render(<PrimaryButton disabled>Nope</PrimaryButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
