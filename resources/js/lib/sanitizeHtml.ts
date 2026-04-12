import DOMPurify from 'dompurify';

if (typeof DOMPurify.addHook === 'function') {
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node.tagName !== 'A') return;
        node.setAttribute('rel', 'noopener noreferrer');
        const t = node.getAttribute('target');
        if (t === '_parent' || t === '_top') {
            node.setAttribute('target', '_blank');
        }
    });
}

/**
 * Alinhado ao que o CMS (TipTap) costuma emitir: sem script, iframe, on*, etc.
 */
const CMS_RICH_TEXT = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ADD_ATTR: ['target'],
};

/**
 * Sanitiza HTML vindo do banco antes de `dangerouslySetInnerHTML` no site público.
 * Defesa em profundidade; o ideal é também sanitizar no servidor ao gravar.
 */
export function sanitizeCmsHtmlForDisplay(html: string): string {
    if (!html) return '';
    return String(DOMPurify.sanitize(html, CMS_RICH_TEXT));
}

/**
 * Remove markup de labels (ex.: paginação Laravel com &laquo;) sem interpretar como DOM vivo na página.
 */
export function stripHtmlToText(html: string): string {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent ?? '';
}
