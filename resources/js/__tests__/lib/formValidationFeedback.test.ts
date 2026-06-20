import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
    EVENT_FORM_FIELD_ORDER,
    getFormErrorMessages,
    notifyFormValidationErrors,
    scrollToFirstValidationError,
} from '@/lib/formValidationFeedback';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe('formValidationFeedback', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('orders event form errors by field priority', () => {
        const messages = getFormErrorMessages(
            {
                tag_ids: 'El campo tags es obligatorio.',
                title: 'El campo título es obligatorio.',
            },
            EVENT_FORM_FIELD_ORDER,
        );

        expect(messages).toEqual([
            'El campo título es obligatorio.',
            'El campo tags es obligatorio.',
        ]);
    });

    it('scrolls to the first invalid field marker', async () => {
        const target = document.createElement('div');
        target.setAttribute('data-validation-field', 'title');
        document.body.appendChild(target);

        const scrollIntoView = vi.fn();
        target.scrollIntoView = scrollIntoView;

        scrollToFirstValidationError(
            { description: 'Falta descripción', title: 'Falta título' },
            EVENT_FORM_FIELD_ORDER,
        );

        await new Promise((resolve) => requestAnimationFrame(resolve));

        expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    });

    it('shows a toast summary when validation fails', () => {
        notifyFormValidationErrors(
            {
                title: 'El campo título es obligatorio.',
                description: 'El campo descripción es obligatorio.',
            },
            EVENT_FORM_FIELD_ORDER,
        );

        expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining('2 campos con error'),
            expect.objectContaining({ autoClose: 6000 }),
        );
    });
});
