import React from "react";
import TimeRangePicker from "@/Components/TimeRangePicker";
import moment from "moment";
import { trans } from '@/utils';
import Checkbox from "@/Components/Checkbox";

export default function WorkingHours({ handleOnChange, workingHours }) {

    const handleTimeRangeChange = (event) => {
        const updatedWorkingHours = workingHours.map(dayInfo => {
            if (dayInfo.day === event.day) {
                dayInfo.hours[0].start = event.newStart.format("HH:mm");
                dayInfo.hours[0].end = event.newEnd.format("HH:mm");
            }
            return dayInfo;
        });

        handleOnChange({ target: { name: "working_hours", value: updatedWorkingHours } });
    };
    const handleTimeRangeChange2 = (event) => {
        const updatedWorkingHours = workingHours.map(dayInfo => {
            if (dayInfo.day === event.day) {
                dayInfo.hours[1].start = event.newStart.format("HH:mm");
                dayInfo.hours[1].end = event.newEnd.format("HH:mm");
            }
            return dayInfo;
        });

        handleOnChange({ target: { name: "working_hours", value: updatedWorkingHours } });
    };

    const addHourRange = (day) => {
        const updatedWorkingHours = workingHours.map(dayInfo => {
            if (dayInfo.day === day) {
                let newHour = {
                    start: '14:00',
                    end: '18:00',
                };

                dayInfo.hours.push(newHour);
            }
            return dayInfo;
        });

        handleOnChange({ target: { name: "working_hours", value: updatedWorkingHours } });
    }

    const removeHourRange = (day) => {
        const updatedWorkingHours = workingHours.map(dayInfo => {
            if (dayInfo.day === day) {
                dayInfo.hours.pop();
            }
            return dayInfo;
        });

        handleOnChange({ target: { name: "working_hours", value: updatedWorkingHours } });
    }

    const checkChange = (event) => {
        const updatedWorkingHours = workingHours.map(dayInfo => {
            if (dayInfo.day === event.target.name) {
                dayInfo.enable = event.target.checked;
            }
            return dayInfo;
        });

        handleOnChange({ target: { name: "working_hours", value: updatedWorkingHours } });
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
                                                start={moment(start, "HH:mm")}
                                                end={moment(end, "HH:mm")}
                                                day={dayInfo.day}
                                                minuteStep={10}
                                                onChange={handleTimeRangeChange}
                                            />
                                            {dayInfo.hours.length <= 1 ? (
                                                <button className="ml-2 font-bold cursor-pointer" type="button" onClick={() => {
                                                    addHourRange(dayInfo.day);
                                                }}>
                                                    Add
                                                </button>
                                            ) : (
                                                <div className="flex">

                                                    <div className="mx-4">
                                                        -
                                                    </div>

                                                    <TimeRangePicker
                                                        start={moment(dayInfo.hours[1].start, "HH:mm")}
                                                        end={moment(dayInfo.hours[1].end, "HH:mm")}
                                                        day={dayInfo.day}
                                                        minuteStep={10}
                                                        onChange={handleTimeRangeChange2}
                                                    />

                                                    <button className="ml-2 font-bold cursor-pointer" type="button" onClick={() => {
                                                        removeHourRange(dayInfo.day);
                                                    }}>
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
