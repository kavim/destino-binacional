import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/Components/ui/button';

describe('Button', () => {
  it('renderiza com texto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('aplica variante default', () => {
    render(<Button variant="default">Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-primary');
  });

  it('aplica variante destructive', () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-destructive');
  });

  it('aplica variante outline com bordas semânticas', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('border-border');
  });

  it('aplica variante success', () => {
    render(<Button variant="success">Salvar</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-success');
  });

  it('aplica tamanho sm', () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-9');
  });

  it('aplica tamanho icon', () => {
    render(<Button size="icon">I</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-10');
    expect(btn.className).toContain('w-10');
  });

  it('repassa disabled corretamente', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('mescla classes customizadas', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('my-custom-class');
  });
});
