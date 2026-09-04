import { describe, expect, it } from 'vitest';
import { htmlToMetaDescription, toAbsoluteUrl } from '@/lib/seo';

describe('htmlToMetaDescription', () => {
  it('usa fallback quando o HTML está vazio', () => {
    expect(htmlToMetaDescription('', 'Destino Binacional')).toBe('Destino Binacional');
  });

  it('remove tags e trunca', () => {
    const html = '<p>Rivera e Santana do Livramento são cidades gêmeas com muita cultura e paisagem.</p>';
    const result = htmlToMetaDescription(html, 'fallback', 40);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(40);
    expect(result).not.toContain('<p>');
  });
});

describe('toAbsoluteUrl', () => {
  it('mantém URL absoluta', () => {
    expect(toAbsoluteUrl('https://cdn.example/a.jpg', 'https://site.test')).toBe(
      'https://cdn.example/a.jpg',
    );
  });

  it('prefixa origin em caminhos relativos', () => {
    expect(toAbsoluteUrl('/images/parque.webp', 'https://destinobinacional.com')).toBe(
      'https://destinobinacional.com/images/parque.webp',
    );
  });
});
