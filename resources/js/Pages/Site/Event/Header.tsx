import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const HERO_BG = '/images/evento_bg.webp';
const FALLBACK_BG = '/images/parque.webp';

type HeaderProps = {
    category?: unknown;
};

export default function CategoryHeader(_props: HeaderProps = {}) {
    const [bgSrc, setBgSrc] = useState(HERO_BG);

    return (
        <div className="w-full">
            <div
                className={cn(
                    'relative isolate flex min-h-[38vh] items-center overflow-hidden text-center text-sm font-bold leading-none text-white sm:min-h-[45vh] md:min-h-[50vh]',
                )}
            >
                <img
                    src={bgSrc}
                    alt=""
                    width={1920}
                    height={1080}
                    decoding="async"
                    className="absolute inset-0 z-0 h-full w-full object-cover object-center header-filters"
                    onError={() =>
                        setBgSrc((prev) => (prev !== FALLBACK_BG ? FALLBACK_BG : prev))
                    }
                />
                <div
                    className="degrade pointer-events-none absolute inset-0 z-[1]"
                    aria-hidden
                />
                <div className="relative z-10 mx-auto flex w-full max-w-[min(90rem,calc(100vw-2rem))] flex-col items-center justify-center gap-3 px-4 py-10 text-balance sm:px-8 md:flex-row md:gap-4 md:px-10 md:py-12">
                    <div className="shrink-0">
                        <img
                            src="/images/icons/eventos.svg"
                            alt=""
                            width={96}
                            height={96}
                            decoding="async"
                            className="h-auto w-16 drop-shadow-md sm:w-20 md:w-24"
                        />
                    </div>
                    <div className="max-w-full px-1">
                        <h1 className="text-balance text-2xl font-extrabold break-words sm:text-3xl md:text-5xl">
                            Calendario binacional de Eventos
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
