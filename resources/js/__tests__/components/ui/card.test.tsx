import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/Components/ui/card';

describe('Card', () => {
  it('renderiza com conteúdo filho', () => {
    render(<Card data-testid="card">Hello</Card>);
    expect(screen.getByTestId('card')).toHaveTextContent('Hello');
  });

  it('usa bordas semânticas (border-border)', () => {
    render(<Card data-testid="card">C</Card>);
    expect(screen.getByTestId('card').className).toContain('border-border');
  });

  it('usa border-radius arredondado (rounded-xl)', () => {
    render(<Card data-testid="card">C</Card>);
    expect(screen.getByTestId('card').className).toContain('rounded-xl');
  });

  it('mescla classes customizadas', () => {
    render(<Card data-testid="card" className="extra-class">C</Card>);
    expect(screen.getByTestId('card').className).toContain('extra-class');
  });
});

describe('CardHeader / CardTitle / CardDescription', () => {
  it('renderiza header, title e description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Titulo</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByText('Titulo')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});

describe('CardContent / CardFooter', () => {
  it('renderiza conteúdo e footer', () => {
    render(
      <Card>
        <CardContent>Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });
});
