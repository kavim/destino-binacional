import TimeRangePicker from '@/Components/TimeRangePicker';
import type { TimeRangeChangePayload } from '@/Components/TimeRangePicker';
import { trans } from '@/utils';
import Checkbox from '@/Components/Checkbox';

type HourSlot = { start: string; end: string };

export type DayWorkingHours = {
    day: string;
    enable: boolean;
    hours: HourSlot[];
};

type WorkingHoursProps = {
    handleOnChange: (e: {
        target: { name: string; value: DayWorkingHours[] };
    }) => void;
    workingHours: DayWorkingHours[];
};

export default function WorkingHours({
    handleOnChange,
    workingHours,
}: WorkingHoursProps) {
    const emit = (value: DayWorkingHours[]) => {
        handleOnChange({ target: { name: 'working_hours', value } });
    };

    const handleTimeRangeChange = (event: TimeRangeChangePayload, slotIndex: number) => {
        emit(
            workingHours.map((dayInfo) => {
                if (dayInfo.day !== event.day) {
                    return dayInfo;
                }

                return {
                    ...dayInfo,
                    hours: dayInfo.hours.map((slot, index) =>
                        index === slotIndex
                            ? { start: event.newStart, end: event.newEnd }
                            : slot,
                    ),
                };
            }),
        );
    };

    const addHourRange = (day: string) => {
        emit(
            workingHours.map((dayInfo) => {
                if (dayInfo.day !== day) {
                    return dayInfo;
                }

                return {
                    ...dayInfo,
                    hours: [...dayInfo.hours, { start: '14:00', end: '18:00' }],
                };
            }),
        );
    };

    const removeHourRange = (day: string) => {
        emit(
            workingHours.map((dayInfo) => {
                if (dayInfo.day !== day) {
                    return dayInfo;
                }

                return {
                    ...dayInfo,
                    hours: dayInfo.hours.slice(0, -1),
                };
            }),
        );
    };

    const checkChange = (event: { target: { name?: string; checked: boolean } }) => {
        emit(
            workingHours.map((dayInfo) => {
                if (dayInfo.day !== event.target.name) {
                    return dayInfo;
                }

                return { ...dayInfo, enable: event.target.checked };
            }),
        );
    };

    return (
        <div>
            <div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <td></td>
                            <td>Day</td>
                            <td>Hours</td>
                        </tr>
                    </thead>
                    <tbody>
                        {workingHours.map((dayInfo, index) => {
                            const { start, end } = dayInfo.hours[0];

                            return (
                                <tr key={index} className="border">
                                    <td className="px-2 pt-2">
                                        <Checkbox
                                            name={dayInfo.day}
                                            isChecked={dayInfo.enable}
                                            onChange={checkChange}
                                        />
                                    </td>
                                    <td>
                                        <h2 className="text-xl font-semibold">
                                            {trans(`working_days.${dayInfo.day}`)}
                                        </h2>
                                    </td>
                                    <td>
                                        <div className="flex">
                                            <TimeRangePicker
                                                start={start}
                                                end={end}
                                                day={dayInfo.day}
                                                minuteStep={10}
                                                onChange={(payload) =>
                                                    handleTimeRangeChange(payload, 0)
                                                }
                                            />
                                            {dayInfo.hours.length <= 1 ? (
                                                <button
                                                    className="ml-2 cursor-pointer font-bold"
                                                    type="button"
                                                    onClick={() => {
                                                        addHourRange(dayInfo.day);
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            ) : (
                                                <div className="flex">
                                                    <div className="mx-4">-</div>

                                                    <TimeRangePicker
                                                        start={dayInfo.hours[1].start}
                                                        end={dayInfo.hours[1].end}
                                                        day={dayInfo.day}
                                                        minuteStep={10}
                                                        onChange={(payload) =>
                                                            handleTimeRangeChange(payload, 1)
                                                        }
                                                    />

                                                    <button
                                                        className="ml-2 cursor-pointer font-bold"
                                                        type="button"
                                                        onClick={() => {
                                                            removeHourRange(dayInfo.day);
                                                        }}
                                                    >
                                                        remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
