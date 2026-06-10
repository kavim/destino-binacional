import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoryGallery } from '@/Components/site/useStoryGallery';

export type SiteGalleryImage = {
    id: number;
    url: string;
    width?: number | null;
    height?: number | null;
};

type ImageGalleryProps = {
    images: SiteGalleryImage[];
};

const GALLERY_ARIA_LABEL = 'Galería de imágenes';

type StoryProgressBarsProps = {
    count: number;
    activeIndex: number;
    progress: number;
};

function StoryProgressBars({ count, activeIndex, progress }: StoryProgressBarsProps) {
    if (count <= 1) {
        return (
            <div className="absolute inset-x-0 top-0 z-30 px-3 pt-3">
                <div className="h-0.5 overflow-hidden rounded-full bg-white/30">
                    <div className="h-full w-full rounded-full bg-white" />
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-x-0 top-0 z-30 flex gap-1 px-3 pt-3">
            {Array.from({ length: count }, (_, index) => (
                <div
                    key={index}
                    className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                    <div
                        className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear motion-reduce:transition-none"
                        style={{
                            width:
                                index < activeIndex
                                    ? '100%'
                                    : index === activeIndex
                                      ? `${progress}%`
                                      : '0%',
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const {
        activeIndex,
        progress,
        containerRef,
        goNext,
        goPrev,
        goTo,
        pause,
        resume,
        handlePointerDown,
        handlePointerUp,
        handleTouchStart,
        handleTouchEnd,
        handleClick,
    } = useStoryGallery(images.length);

    if (!images.length) {
        return null;
    }

    const activeImage = images[activeIndex];
    const canNavigate = images.length > 1;

    return (
        <section className="w-full">
            <div
                ref={containerRef}
                role="region"
                aria-roledescription="carousel"
                aria-label={GALLERY_ARIA_LABEL}
                className={cn(
                    'relative -mx-6 select-none overflow-hidden bg-black',
                    'aspect-[9/16] rounded-none',
                    'md:mx-0 md:aspect-auto md:min-h-[24rem] md:max-h-[70vh] md:rounded-2xl',
                )}
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onMouseEnter={pause}
                onMouseLeave={resume}
            >
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-black/60 to-transparent"
                    aria-hidden
                />

                <StoryProgressBars
                    count={images.length}
                    activeIndex={activeIndex}
                    progress={progress}
                />

                <img
                    key={activeImage.id}
                    src={activeImage.url}
                    alt=""
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover md:object-contain"
                />

                {canNavigate ? (
                    <>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                goPrev();
                            }}
                            className="absolute left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 md:flex"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                goNext();
                            }}
                            className="absolute right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 md:flex"
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden />
                        </button>
                    </>
                ) : null}

                <span className="absolute bottom-3 right-3 z-30 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                    {activeIndex + 1}/{images.length}
                </span>
            </div>

            {canNavigate ? (
                <div className="mt-3 hidden gap-2 overflow-x-auto md:flex">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => goTo(index)}
                            className={cn(
                                'shrink-0 overflow-hidden rounded-lg border-2 border-transparent transition focus:outline-none focus:ring-2 focus:ring-ring',
                                index === activeIndex && 'border-primary ring-2 ring-primary/30',
                            )}
                            aria-label={`Ver imagen ${index + 1}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                        >
                            <img
                                src={image.url}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="h-14 w-20 object-cover"
                            />
                        </button>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
