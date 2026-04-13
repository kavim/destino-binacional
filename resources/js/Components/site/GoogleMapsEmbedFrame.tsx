type GoogleMapsEmbedFrameProps = {
    src: string;
    title?: string;
    className?: string;
};

/** Iframe do Google Maps — só montar quando `src` vier de `normalizeGoogleMapsEmbedSrc`. */
export default function GoogleMapsEmbedFrame({
    src,
    title = 'Google Maps',
    className = 'relative mt-4 min-h-[min(45vh,380px)] w-full overflow-hidden rounded-lg border border-border bg-muted/20',
}: GoogleMapsEmbedFrameProps) {
    return (
        <div className={className}>
            <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={src}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
            />
        </div>
    );
}
