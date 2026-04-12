import "rc-time-picker/assets/index.css";
import React, { useState } from "react";
import type { Moment } from "moment";
import TimePicker from "rc-time-picker";

export type TimeRangeChangePayload = {
    day: string;
    newStart: Moment;
    newEnd: Moment;
};

type TimeRangePickerProps = {
    day: string;
    start: Moment;
    end: Moment;
    minuteStep: number;
    onChange: (payload: TimeRangeChangePayload) => void;
};

const TimeRangePicker = ({
    day,
    start,
    end,
    minuteStep,
    onChange,
}: TimeRangePickerProps) => {
    const [newStart, setNewStart] = useState(start.clone());
    const [newEnd, setNewEnd] = useState(end.clone());

    const handleStart = (value: Moment) => {
        setNewStart(value);
        onChange({ day, newStart: value, newEnd: end });
    };
    const handleEnd = (value: Moment) => {
        setNewEnd(value);
        onChange({ day, newStart: start, newEnd: value });
    };

    return (
        <div className="flex">
            <div className="mr-2">
                <TimePicker
                    value={newStart}
                    minuteStep={minuteStep}
                    showSecond={false}
                    onChange={handleStart}
                />
            </div>
            <div>
                <TimePicker
                    value={newEnd}
                    minuteStep={minuteStep}
                    showSecond={false}
                    onChange={handleEnd}
                />
            </div>
        </div>
    );
};

export default TimeRangePicker;
