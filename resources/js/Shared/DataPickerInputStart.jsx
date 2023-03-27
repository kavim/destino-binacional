import Datepicker from "react-tailwindcss-datepicker";
import { useState, useEffect } from "react";

export default function DataPickerInputStart({ start, handleOnChange, className }) {
    const [value, setValue] = useState({
        startDate: new Date(start),
        endDate: new Date(start)
    });

    const handleValueChange = (newValue) => {
        setValue(newValue);
    }

    useEffect(() => {
        handleOnChange({ target: { name: 'start', value: value.endDate } });
    }, [value]);

    return (
        <Datepicker
            i18n={"es_ES"}
            placeholder={"Seleccione la fecha de inicio del evento"}
            value={value}
            useRange={false}
            asSingle={true}
            onChange={handleValueChange}
            containerClassName={className}
        />
    );
}
