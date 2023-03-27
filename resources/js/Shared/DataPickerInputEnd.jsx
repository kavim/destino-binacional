import Datepicker from "react-tailwindcss-datepicker";
import { useState, useEffect } from "react";

export default function DataPickerInputEnd({ end, handleOnChange, className }) {
    const [value, setValue] = useState({
        startDate: new Date(end),
        endDate: new Date(end)
    });

    const handleValueChange = (newValue) => {
        setValue(newValue);
    }

    useEffect(() => {
        handleOnChange({ target: { name: 'end', value: value.endDate } });
    }, [value]);

    return (
        <Datepicker
            i18n={"es_ES"}
            placeholder={"Seleccione la fecha de cierre del evento"}
            value={value}
            useRange={false}
            asSingle={true}
            onChange={handleValueChange}
            containerClassName={className}
        />
    );
}
