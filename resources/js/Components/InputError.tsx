interface InputErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
    message?: string;
}

export default function InputError({ message, className = '', ...props }: InputErrorProps) {
    return message ? (
        <p {...props} className={'text-sm text-destructive ' + className}>
            {message}
        </p>
    ) : null;
}
