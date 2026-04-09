import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const HERO_BG = '/images/evento_bg.webp';
const FALLBACK_BG = '/images/parque.webp';

type HeaderProps = {
    category?: unknown;
};

/**
 * Hero da listagem pública de eventos — contraste forte no mobile e altura adaptada a ecrãs pequenos.
 */
export default function EventsListingHero(_props: HeaderProps = {}) {
    const [bgSrc, setBgSrc] = useState(HERO_BG);

    return (
        <div className="relative w-full">
            <div
                className={cn(
                    'relative isolate flex min-h-[min(52svh,22rem)] items-center overflow-hidden sm:min-h-[40vh] md:min-h-[46vh] lg:min-h-[50vh]',
                )}
            >
                <img
                    src={bgSrc}
                    alt=""
                    width={1920}
                    height={1080}
                    decoding="async"
                    fetchPriority="high"
                    className="absolute inset-0 z-0 h-full w-full object-cover object-[center_30%] sm:object-center header-filters"
                    onError={() =>
                        setBgSrc((prev) => (prev !== FALLBACK_BG ? FALLBACK_BG : prev))
                    }
                />
                {/* Camadas de leitura: escurece imagem + gradiente inferior para fundir com a página */}
                <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/65 to-black/80 sm:from-black/45 sm:via-black/55 sm:to-black/75"
                    aria-hidden
                />
                <div
                    className="degrade pointer-events-none absolute inset-0 z-[1] opacity-90 sm:opacity-100"
                    aria-hidden
                />

                <div className="relative z-10 mx-auto flex w-full max-w-[min(90rem,calc(100vw-1.5rem))] flex-col items-center justify-center gap-4 px-4 py-10 pb-16 text-center sm:px-6 sm:pb-14 md:flex-row md:gap-6 md:px-10 md:py-14 md:text-left lg:px-12">
                    <div className="shrink-0 drop-shadow-lg">
                        <img
                            src="/images/icons/eventos.svg"
                            alt=""
                            width={96}
                            height={96}
                            decoding="async"
                            className="mx-auto h-auto w-14 text-white brightness-0 invert sm:mx-0 sm:w-20 md:w-24"
                        />
                    </div>
                    <div className="max-w-2xl rounded-2xl bg-black/30 px-4 py-3 shadow-lg backdrop-blur-sm sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-none md:max-w-3xl">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
                            Agenda
                        </p>
                        <h1 className="text-balance break-words text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl">
                            Calendário binacional de eventos
                        </h1>
                        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/90 sm:text-base md:mx-0 md:max-w-2xl">
                            Descubra o que acontece na região. Filtre por datas e abra cada evento para
                            detalhes, local ou link online.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
