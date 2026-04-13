import SiteListingHero from '@/Components/site/SiteListingHero';

type HeaderProps = {
    category?: unknown;
};

/**
 * Hero da listagem pública de eventos — contraste forte no mobile e altura adaptada a ecrãs pequenos.
 */
export default function EventsListingHero(_props: HeaderProps = {}) {
    return (
        <SiteListingHero
            backgroundSrc="/images/evento_bg.webp"
            iconSrc="/images/icons/eventos.svg"
            kicker="Agenda"
            title="Calendário binacional de eventos"
            description="Descubra o que acontece na região. Filtre por datas e abra cada evento para detalhes, local ou link online."
        />
    );
}
