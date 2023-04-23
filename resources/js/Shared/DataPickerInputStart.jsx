import Datepicker from "react-tailwindcss-datepicker";
import { useState, useEffect } from "react";

export default function DataPickerInputStart({ start, handleOnChange, className, placeholder }) {
    const [value, setValue] = useState({
        startDate: new Date(start).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'),
        endDate: new Date(start).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'),
    });

    const handleValueChange = (newValue) => {
        setValue(newValue);
    }

    useEffect(() => {
        if (value !== null && value.startDate !== null && value.startDate !== undefined && value.startDate !== '' && value.startDate !== 'Invalid Date') {

        }
        handleOnChange({ target: { name: 'start', value: value.startDate } });
    }, [value]);

    return (
        <Datepicker
            i18n={"es_ES"}
            placeholder={placeholder ?? "Seleccione la fecha de inicio del evento"}
            value={value}
            useRange={false}
            asSingle={true}
            onChange={handleValueChange}
            containerClassName={className}
            displayFormat={"DD/MM/YYYY"}
        />
    );
}
