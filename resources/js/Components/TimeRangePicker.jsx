import "rc-time-picker/assets/index.css";
import React, { useState } from "react";
import moment from "moment";
import TimePicker from "rc-time-picker";

const isBeforeTime = (time1, time2) =>
  time1.minutes() + time1.hours() * 60 < time2.minutes() + time2.hours();

const TimeRangePicker = ({day, start, end, minuteStep, onChange}) => {
  const [newStart, setNewStart] = useState(start.clone());
  const [newEnd, setNewEnd] = useState(end.clone());

  const handleStart = (value) => {
      setNewStart(value);
      onChange({day: day, newStart: value, newEnd: end});
  };
  const handleEnd= (value) => {
      setNewEnd(value);
      onChange({day: day, newStart: start, newEnd: value});
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
