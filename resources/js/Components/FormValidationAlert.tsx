import {
    getFormErrorMessages,
    type FormErrors,
} from '@/lib/formValidationFeedback';

type FormValidationAlertProps = {
    errors: FormErrors;
    fieldOrder?: readonly string[];
};

export default function FormValidationAlert({ errors, fieldOrder }: FormValidationAlertProps) {
    const messages = getFormErrorMessages(errors, fieldOrder);
    if (messages.length === 0) {
        return null;
    }

    return (
        <div
            role="alert"
            className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
            <p className="font-semibold">Hay campos obligatorios sin completar:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
                {messages.map((message) => (
                    <li key={message}>{message}</li>
                ))}
            </ul>
        </div>
    );
}
