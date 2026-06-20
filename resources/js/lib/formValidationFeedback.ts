import { toast } from 'react-toastify';

export type FormErrors = Record<string, string | string[] | undefined>;

export const EVENT_FORM_FIELD_ORDER = [
    'featured_image',
    'image',
    'title',
    'description',
    'start',
    'end',
    'tag_ids',
    'google_maps_src',
    'address',
    'city_id',
    'link',
] as const;

export function normalizeFormErrorMessage(message: string | string[] | undefined): string | undefined {
    if (!message) {
        return undefined;
    }

    return Array.isArray(message) ? message[0] : message;
}

export function getFormErrorMessages(errors: FormErrors, fieldOrder?: readonly string[]): string[] {
    const messages: string[] = [];
    const seen = new Set<string>();

    const addField = (field: string) => {
        const message = normalizeFormErrorMessage(errors[field]);
        if (message && !seen.has(message)) {
            seen.add(message);
            messages.push(message);
        }
    };

    if (fieldOrder) {
        fieldOrder.forEach(addField);
    }

    Object.keys(errors).forEach((field) => {
        if (!fieldOrder?.includes(field)) {
            addField(field);
        }
    });

    return messages;
}

export function scrollToFirstValidationError(
    errors: FormErrors,
    fieldOrder: readonly string[],
): void {
    const firstField = fieldOrder.find((field) => Boolean(normalizeFormErrorMessage(errors[field])));
    if (!firstField) {
        return;
    }

    requestAnimationFrame(() => {
        const element =
            document.querySelector(`[data-validation-field="${firstField}"]`) ??
            document.getElementById(firstField) ??
            document.querySelector(`[name="${firstField}"]`);

        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (element instanceof HTMLElement && typeof element.focus === 'function') {
            element.focus({ preventScroll: true });
        }
    });
}

export function notifyFormValidationErrors(
    errors: FormErrors,
    fieldOrder: readonly string[],
): void {
    const messages = getFormErrorMessages(errors, fieldOrder);
    if (messages.length === 0) {
        return;
    }

    const body =
        messages.length === 1
            ? messages[0]
            : [
                  `${messages.length} campos con error:`,
                  ...messages.slice(0, 4).map((message) => `• ${message}`),
                  ...(messages.length > 4 ? [`• …y ${messages.length - 4} más`] : []),
              ].join('\n');

    toast.error(body, { autoClose: 6000 });
    scrollToFirstValidationError(errors, fieldOrder);
}
