import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import TimeRangePicker from '@/Components/TimeRangePicker';

describe('TimeRangePicker', () => {
    it('emite HH:mm ao mudar o início', () => {
        const onChange = vi.fn();

        render(
            <TimeRangePicker
                day="mon"
                start="08:00"
                end="12:00"
                minuteStep={10}
                onChange={onChange}
            />,
        );

        fireEvent.change(screen.getByLabelText('Início'), { target: { value: '09:30' } });

        expect(onChange).toHaveBeenCalledWith({
            day: 'mon',
            newStart: '09:30',
            newEnd: '12:00',
        });
    });
});
