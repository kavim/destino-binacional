import { stripHtmlToText } from '@/lib/sanitizeHtml';

/** A partir deste tamanho, a galeria vai para a coluna lateral acima do mapa. */
export const LONG_CMS_DESCRIPTION_MIN_CHARS = 500;

export function isLongCmsDescription(
    html: string,
    minChars: number = LONG_CMS_DESCRIPTION_MIN_CHARS,
): boolean {
    return stripHtmlToText(html).trim().length >= minChars;
}
