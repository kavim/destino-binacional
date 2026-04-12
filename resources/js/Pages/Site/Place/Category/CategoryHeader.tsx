import SiteListingHero from '@/Components/site/SiteListingHero';

type CategoryHeaderProps = {
    category: {
        name: string;
        featured_image: string;
        icon: string;
        color?: string | null;
    };
};

/**
 * Hero da página de categoria — mesmo componente base que eventos e tours.
 */
export default function CategoryHeader({ category }: CategoryHeaderProps) {
    return (
        <SiteListingHero
            backgroundSrc={category.featured_image}
            iconSrc={category.icon}
            kicker="Categoria"
            title={category.name}
            description="Descubra lugares y servicios de esta categoría en la región."
        />
    );
}
