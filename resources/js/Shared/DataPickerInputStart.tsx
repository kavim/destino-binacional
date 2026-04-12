import DatePicker from 'react-date-picker';
import type { DatePickerValue } from '@/lib/datePickerValue';

type DataPickerInputStartProps = {
    start: string;
    handleOnChange: (value: DatePickerValue) => void;
    className?: string;
};

export default function DataPickerInputStart({ start, handleOnChange, className }: DataPickerInputStartProps) {
    const parseDate = (dateStr: unknown) => {
        if (!dateStr || typeof dateStr !== 'string') return null;
        return new Date(dateStr.replace(/-/g, '/'));
    };

    return (
        <div className={className}>
            <DatePicker
                onChange={handleOnChange}
                value={parseDate(start)}
                locale="es-UY"
                format="dd/MM/yyyy"
                className="mt-1 block w-full font-semibold text-foreground kimput"
                calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                clearIcon={start ? undefined : null}
            />
        </div>
    );
}
