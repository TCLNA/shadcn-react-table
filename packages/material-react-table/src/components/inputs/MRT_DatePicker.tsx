import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

export interface MRT_DatePickerProps {
  /**
   * The selected date value
   */
  value?: Date;
  /**
   * Callback fired when the date changes
   */
  onChange?: (date: Date | undefined) => void;
  /**
   * Placeholder text when no date is selected
   * @default "Pick a date"
   */
  placeholder?: string;
  /**
   * Date format string for display (date-fns format)
   * @default "PPP" (e.g., "Apr 29, 2023")
   */
  dateFormat?: string;
  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional CSS classes for the trigger button
   */
  className?: string;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Additional props to pass to the Calendar component
   */
  calendarProps?: React.ComponentProps<typeof Calendar>;
  /**
   * Additional props to pass to the Input component
   */
  inputProps?: React.ComponentProps<typeof Input>;
}

/**
 * MRT_DatePicker - A date picker component built with react-day-picker and shadcn/ui
 * 
 * This component provides a date selection interface using a calendar popover.
 * It integrates with the table's filtering system for date-based filtering.
 * 
 * @example
 * ```tsx
 * <MRT_DatePicker
 *   value={selectedDate}
 *   onChange={(date) => setSelectedDate(date)}
 *   placeholder="Select date"
 * />
 * ```
 */
export const MRT_DatePicker = React.forwardRef<
  HTMLInputElement,
  MRT_DatePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = 'Pick a date',
      dateFormat = 'PPP',
      disabled = false,
      className,
      minDate,
      maxDate,
      calendarProps,
      inputProps,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
    };

    const displayValue = value ? format(value, dateFormat) : '';

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={ref}
              value={displayValue}
              placeholder={placeholder}
              disabled={disabled}
              readOnly
              className={cn(
                'h-8 cursor-pointer pr-8',
                !value && 'text-muted-foreground',
                className,
              )}
              onClick={(e) => {
                if (!disabled) {
                  e.stopPropagation();
                  setOpen(true);
                }
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!disabled) {
                    setOpen(true);
                  }
                }
              }}
              {...inputProps}
            />
            <CalendarIcon
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4',
                disabled ? 'text-muted-foreground' : 'text-foreground',
              )}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value as any}
            onSelect={handleSelect as any}
            disabled={
              minDate || maxDate
                ? (date) => {
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    return false;
                  }
                : undefined
            }
            initialFocus
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

MRT_DatePicker.displayName = 'MRT_DatePicker';
