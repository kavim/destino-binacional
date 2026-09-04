import { Head, usePage } from '@inertiajs/react';
import { htmlToMetaDescription, SEO_FALLBACK_IMAGE, toAbsoluteUrl } from '@/lib/seo';
import { trans } from '@/utils';

type SeoHeadProps = {
    title: string;
    description?: string | null;
    image?: string | null;
    htmlDescription?: string | null;
};

export default function SeoHead({ title, description, image, htmlDescription }: SeoHeadProps) {
    const page = usePage();
    const ziggy = page.props.ziggy;
    const origin = (ziggy?.url ?? (typeof window !== 'undefined' ? window.location.origin : '')).replace(
        /\/$/,
        '',
    );
    const canonical = ziggy?.location ?? `${origin}${page.url.split('?')[0] || '/'}`;
    const fallback = trans('seo.fallback');
    const metaDescription = htmlToMetaDescription(htmlDescription ?? description ?? '', fallback);
    const ogImage = toAbsoluteUrl(image || SEO_FALLBACK_IMAGE, origin || canonical);

    return (
        <Head title={title}>
            <meta head-key="description" name="description" content={metaDescription} />
            <meta head-key="og:title" property="og:title" content={title} />
            <meta head-key="og:description" property="og:description" content={metaDescription} />
            <meta head-key="og:image" property="og:image" content={ogImage} />
            <meta head-key="og:url" property="og:url" content={canonical} />
            <meta head-key="og:type" property="og:type" content="website" />
            <link head-key="canonical" rel="canonical" href={canonical} />
        </Head>
    );
}
