import ImageGallery, { type SiteGalleryImage } from '@/Components/site/ImageGallery';
import { cn } from '@/lib/utils';

type SiteShowGalleryBlockProps = {
    images: SiteGalleryImage[];
    className?: string;
};

export default function SiteShowGalleryBlock({
    images,
    className,
}: SiteShowGalleryBlockProps) {
    if (!images.length) {
        return null;
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border border-border bg-white px-0 pb-4 pt-0 shadow-lg dark:bg-card md:p-6',
                className,
            )}
        >
            <ImageGallery images={images} />
        </div>
    );
}
