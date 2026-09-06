import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteListingHero from '@/Components/site/SiteListingHero';

describe('SiteListingHero', () => {
    it('usa o título string como alt da foto de fundo', () => {
        render(
            <SiteListingHero
                backgroundSrc="/images/evento_bg.webp"
                iconSrc="/images/icons/eventos.svg"
                kicker="Agenda"
                title="Calendário binacional de eventos"
                description="Filtre por datas."
            />,
        );

        expect(
            screen.getByRole('img', { name: 'Calendário binacional de eventos' }),
        ).toHaveAttribute('src', '/images/evento_bg.webp');
    });
});
