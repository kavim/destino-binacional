import {
    Dialog,
    DialogContent,
} from "@/Components/ui/dialog";

interface ModalProps {
    children: React.ReactNode;
    show?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose?: () => void;
}

const maxWidthMap = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
};

export default function Modal({ children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {} }: ModalProps) {
    return (
        <Dialog open={show} onOpenChange={(open) => { if (!open && closeable) onClose(); }}>
            <DialogContent
                className={maxWidthMap[maxWidth]}
                onInteractOutside={(e) => { if (!closeable) e.preventDefault(); }}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
}
