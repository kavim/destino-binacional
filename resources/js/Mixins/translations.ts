export const translations = {
    methods: {
        __(key: string, replacements: Record<string, string> = {}): string {
            let translation = window._translations[key] || key;

            Object.keys(replacements).forEach((r) => {
                translation = translation.replace(`:${r}`, replacements[r] ?? "");
            });

            return translation;
        },
        trans(key: string, replacements: Record<string, string> = {}): string {
            let translation = window._translations[key] || key;

            Object.keys(replacements).forEach((r) => {
                translation = translation.replace(`:${r}`, replacements[r] ?? "");
            });

            return translation;
        },
    },
};