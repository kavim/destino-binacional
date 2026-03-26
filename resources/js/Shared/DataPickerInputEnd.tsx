import DatePicker from 'react-date-picker';

export default function DataPickerInputEnd({ end, handleOnChange, className }) {
    const parseDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') return null;
        return new Date(dateStr.replace(/-/g, '\/'));
    };

    return (
        <div className={className}>
            <DatePicker
                onChange={handleOnChange}
                value={parseDate(end)}
                locale="es-UY"
                format="dd/MM/yyyy"
                className="mt-1 block w-full font-semibold text-foreground kimput"
                calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                clearIcon={end ? undefined : null}
            />
        </div>
    );
}
