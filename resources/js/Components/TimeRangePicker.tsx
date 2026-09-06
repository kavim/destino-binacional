import { Input } from '@/Components/ui/input';

export type TimeRangeChangePayload = {
    day: string;
    newStart: string;
    newEnd: string;
};

type TimeRangePickerProps = {
    day: string;
    start: string;
    end: string;
    minuteStep: number;
    onChange: (payload: TimeRangeChangePayload) => void;
};

function toHHmm(value: string): string {
    const match = value.match(/^(\d{2}:\d{2})/);
    return match ? match[1] : value;
}

export default function TimeRangePicker({
    day,
    start,
    end,
    minuteStep,
    onChange,
}: TimeRangePickerProps) {
    const stepSeconds = minuteStep * 60;

    return (
        <div className="flex">
            <Input
                type="time"
                className="mr-2 w-[9.5rem]"
                value={start}
                step={stepSeconds}
                aria-label="Início"
                onChange={(e) =>
                    onChange({ day, newStart: toHHmm(e.target.value), newEnd: end })
                }
            />
            <Input
                type="time"
                className="w-[9.5rem]"
                value={end}
                step={stepSeconds}
                aria-label="Fim"
                onChange={(e) =>
                    onChange({ day, newStart: start, newEnd: toHHmm(e.target.value) })
                }
            />
        </div>
    );
}
