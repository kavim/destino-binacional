import Datepicker from "react-tailwindcss-datepicker";
import { useState, useEffect } from "react";

export default function DataPickerInputEnd({ end, handleOnChange, className, placeholder }) {
    const [value, setValue] = useState({
        startDate: new Date(end).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'),
        endDate: new Date(end).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'),
    });

    const handleValueChange = (newValue) => {
        setValue(newValue);
    }
 
    useEffect(() => {
        handleOnChange({ target: { name: 'end', value: value.startDate } });
    }, [value]);

    return (
        <Datepicker
            i18n={"es_ES"}
            placeholder={placeholder ?? "Seleccione la fecha de cierre del evento"}
            value={value}
            useRange={false}
            asSingle={true}
            onChange={handleValueChange}
            containerClassName={className}
            displayFormat={"DD/MM/YYYY"}
        />
    );
}
