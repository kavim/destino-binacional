import DatePicker from 'react-date-picker';
import { useEffect, useState } from "react";

export default function DataPickerInputEnd({ end, handleOnChange, className }) {
    const [value, setValue] = useState(end ? new Date(end) : null);

    const onChange = (date) => {
        setValue(date);
    };

    useEffect(() => {
        const formattedDate = value instanceof Date
            ? value.toLocaleDateString('en-CA') 
            : value;

        handleOnChange({ target: { name: 'end', value: formattedDate } });
    }, [value]);

    return (
        <div className={className}>
            <DatePicker
                onChange={onChange}
                value={value}
                locale="es-UY"
                format="dd/MM/yyyy"
                className="mt-1 block w-full text-stone-800 font-bold kimput"
                calendarClassName="bg-card border border-border rounded-lg shadow-lg"
                clearIcon={null}
            />
        </div>
    );
}