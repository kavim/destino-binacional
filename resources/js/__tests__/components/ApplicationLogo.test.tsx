import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

describe('ApplicationLogo', () => {
  it('renderiza duas imagens (claro e escuro)', () => {
    render(<ApplicationLogo />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
  });

  it('a imagem clara tem classe dark:hidden', () => {
    render(<ApplicationLogo />);
    const images = screen.getAllByRole('img');
    expect(images[0].className).toContain('dark:hidden');
  });

  it('a imagem escura tem classe dark:block', () => {
    render(<ApplicationLogo />);
    const images = screen.getAllByRole('img');
    expect(images[1].className).toContain('dark:block');
  });

  it('aceita className customizado', () => {
    const { container } = render(<ApplicationLogo className="my-logo" />);
    expect(container.firstChild).toHaveClass('my-logo');
  });

  it('aceita prop size="md"', () => {
    render(<ApplicationLogo size="md" />);
    const images = screen.getAllByRole('img');
    expect(images[0].className).toContain('h-16');
  });
});
