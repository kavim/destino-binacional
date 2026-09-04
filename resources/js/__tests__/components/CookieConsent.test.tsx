import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CookieConsent from '@/Components/CookieConsent';
import { COOKIE_CONSENT_KEY } from '@/analytics';

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.head.querySelectorAll('script[src*="hotjar"], script[src*="googletagmanager"]').forEach((el) => {
      el.remove();
    });
    window.__destinoAnalyticsLoaded = false;
  });

  it('mostra o banner quando não há escolha salva', () => {
    render(<CookieConsent />);

    expect(screen.getByRole('dialog', { name: /cookies e analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aceitar cookies' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recusar' })).toBeInTheDocument();
  });

  it('não mostra o banner se o consentimento já foi dado', () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');

    render(<CookieConsent />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('persiste aceite e injeta scripts de analytics', async () => {
    const user = userEvent.setup();

    render(<CookieConsent />);
    await user.click(screen.getByRole('button', { name: 'Aceitar cookies' }));

    expect(window.localStorage.getItem(COOKIE_CONSENT_KEY)).toBe('accepted');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('script[src*="googletagmanager"]')).not.toBeNull();
    expect(document.querySelector('script[src*="hotjar"]')).not.toBeNull();
  });

  it('persiste recusa e não injeta analytics', async () => {
    const user = userEvent.setup();

    render(<CookieConsent />);
    await user.click(screen.getByRole('button', { name: 'Recusar' }));

    expect(window.localStorage.getItem(COOKIE_CONSENT_KEY)).toBe('rejected');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it('fecha com Escape e trata como recusa', async () => {
    const user = userEvent.setup();

    render(<CookieConsent />);
    await user.keyboard('{Escape}');

    expect(window.localStorage.getItem(COOKIE_CONSENT_KEY)).toBe('rejected');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
