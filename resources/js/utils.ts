export function trans(key: string, replacements: Record<string, string | number> = {}) {
    let translation = window._translations[key] || key;

    Object.keys(replacements).forEach((r) => {
        translation = translation.replace(`:${r}`, String(replacements[r]));
    });

    return translation;
}