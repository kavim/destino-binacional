import SiteListingHero from '@/Components/site/SiteListingHero';

/**
 * Hero da listagem pública de tours — mesmo bloco que eventos (SiteListingHero).
 */
export default function ToursListingHero() {
    return (
        <SiteListingHero
            backgroundSrc="/images/tour_bg.webp"
            iconSrc="/images/icons/tours.svg"
            kicker="Experiências"
            title="Roteiros e tours na região"
            description="Conheça passeios com datas e informações essenciais. Abra cada tour para ver detalhes e reservar."
        />
    );
}
