import DatePicker from 'react-date-picker';
import { useState } from "react";

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
                className="mt-1 block w-full text-stone-800 font-bold kimput"
                calendarClassName="bg-white border rounded-lg shadow-lg"
                clearIcon={end ? undefined : null}
            />
        </div>
    );
}