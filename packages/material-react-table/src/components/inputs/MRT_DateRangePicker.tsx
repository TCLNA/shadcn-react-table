import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface MRT_DateRangePickerProps {
  /**
   * The selected date range value
   */
  value?: DateRange;
  /**
   * Callback fired when the date range changes
   */
  onChange?: (dateRange: DateRange | undefined) => void;
  /**
   * Placeholder text when no date range is selected
   * @default "Pick a date range"
   */
  placeholder?: string;
  /**
   * Date format string for display (date-fns format)
   * @default "PPP" (e.g., "Apr 29, 2023")
   */
  dateFormat?: string;
  /**
   * Whether the date range picker is disabled
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
   * Whether to show preset buttons
   * @default true
   */
  showPresets?: boolean;
  /**
   * Additional props to pass to the Calendar component
   */
  calendarProps?: React.ComponentProps<typeof Calendar>;
  /**
   * Additional props to pass to the Input component
   */
  inputProps?: React.ComponentProps<typeof Input>;
}

interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

const getDateRangePresets = (): DateRangePreset[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  return [
    {
      label: 'Today',
      getValue: () => ({ from: today, to: today }),
    },
    {
      label: 'Yesterday',
      getValue: () => ({ from: yesterday, to: yesterday }),
    },
    {
      label: 'Last 7 days',
      getValue: () => ({ from: last7Days, to: today }),
    },
    {
      label: 'Last 30 days',
      getValue: () => ({ from: last30Days, to: today }),
    },
    {
      label: 'This month',
      getValue: () => ({ from: thisMonthStart, to: today }),
    },
    {
      label: 'Last month',
      getValue: () => ({ from: lastMonthStart, to: lastMonthEnd }),
    },
  ];
};

/**
 * MRT_DateRangePicker - A date range picker component built with react-day-picker and shadcn/ui
 * 
 * This component provides a date range selection interface using a calendar popover with preset buttons.
 * It integrates with the table's filtering system for date range-based filtering.
 * 
 * @example
 * ```tsx
 * <MRT_DateRangePicker
 *   value={selectedRange}
 *   onChange={(range) => setSelectedRange(range)}
 *   placeholder="Select date range"
 * />
 * ```
 */
export const MRT_DateRangePicker = React.forwardRef<
  HTMLInputElement,
  MRT_DateRangePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = 'Pick a date range',
      dateFormat = 'PPP',
      disabled = false,
      className,
      minDate,
      maxDate,
      showPresets = true,
      calendarProps,
      inputProps,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const presets = React.useMemo(() => getDateRangePresets(), []);

    const handleSelect = (dateRange: DateRange | undefined) => {
      onChange?.(dateRange);
      // Only close if both dates are selected
      if (dateRange?.from && dateRange?.to) {
        setOpen(false);
      }
    };

    const handlePresetClick = (preset: DateRangePreset) => {
      const range = preset.getValue();
      onChange?.(range);
      setOpen(false);
    };

    const displayValue = React.useMemo(() => {
      if (!value?.from) return '';
      if (!value.to) return format(value.from, dateFormat);
      return `${format(value.from, dateFormat)} - ${format(value.to, dateFormat)}`;
    }, [value, dateFormat]);

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
                !value?.from && 'text-muted-foreground',
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
          <div className="flex">
            {showPresets && (
              <div className="flex flex-col gap-1 border-r p-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Presets
                </div>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            <div>
              <Calendar
                mode="range"
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
                numberOfMonths={2}
                {...calendarProps}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

MRT_DateRangePicker.displayName = 'MRT_DateRangePicker';
