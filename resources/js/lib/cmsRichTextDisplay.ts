import { cn } from '@/lib/utils';

/**
 * Estilos para HTML emitido pelo TipTap no site público.
 * O projeto não usa `@tailwindcss/typography`; classes `prose*` não geram regras CSS.
 * Mantém o mesmo “look” do editor (`CmsRichTextEditor`).
 */
export function cmsRichTextDisplayClassName(className?: string): string {
    return cn(
        'text-sm leading-relaxed',
        '[&_p]:my-2 [&_p:first-child]:mt-0',
        '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:my-0.5',
        '[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2:first-child]:mt-0',
        '[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3:first-child]:mt-0',
        '[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
        '[&_a]:text-primary [&_a]:underline',
        className,
    );
}
