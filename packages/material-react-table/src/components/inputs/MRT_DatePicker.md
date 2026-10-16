# MRT_DatePicker Component

## Overview

The `MRT_DatePicker` component provides a date selection interface built with `react-day-picker` and shadcn/ui's Calendar component. It's designed to integrate seamlessly with Material React Table's filtering system for date-based column filtering.

## Features

- ✅ Built with react-day-picker (v9.13.0+)
- ✅ Styled with Tailwind CSS via shadcn/ui
- ✅ Popover-based calendar interface
- ✅ Date formatting with date-fns
- ✅ Min/max date constraints
- ✅ Keyboard accessible
- ✅ Fully typed with TypeScript
- ✅ No MUI dependencies

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import { MRT_DatePicker } from 'material-react-table';

function MyComponent() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <MRT_DatePicker
      value={date}
      onChange={setDate}
      placeholder="Select a date"
    />
  );
}
```

### With Custom Date Format

```tsx
<MRT_DatePicker
  value={date}
  onChange={setDate}
  dateFormat="MM/dd/yyyy"
  placeholder="MM/DD/YYYY"
/>
```

### With Date Constraints

```tsx
<MRT_DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date('2024-01-01')}
  maxDate={new Date('2024-12-31')}
  placeholder="Select date in 2024"
/>
```

### In Table Filter Context

```tsx
const columns = [
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    filterVariant: 'date',
    Filter: ({ column }) => {
      const [date, setDate] = useState<Date | undefined>(
        column.getFilterValue() as Date | undefined
      );

      return (
        <MRT_DatePicker
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
            column.setFilterValue(newDate);
          }}
        />
      );
    },
  },
];
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | - | The selected date value |
| `onChange` | `(date: Date \| undefined) => void` | - | Callback fired when the date changes |
| `placeholder` | `string` | `"Pick a date"` | Placeholder text when no date is selected |
| `dateFormat` | `string` | `"PPP"` | Date format string for display (date-fns format) |
| `disabled` | `boolean` | `false` | Whether the date picker is disabled |
| `className` | `string` | - | Additional CSS classes for the trigger input |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `calendarProps` | `CalendarProps` | - | Additional props to pass to the Calendar component |
| `inputProps` | `InputProps` | - | Additional props to pass to the Input component |

## Date Format Tokens

The `dateFormat` prop uses date-fns format tokens:

- `PPP` - Apr 29, 2023 (default)
- `MM/dd/yyyy` - 04/29/2023
- `yyyy-MM-dd` - 2023-04-29
- `MMMM d, yyyy` - April 29, 2023
- `dd MMM yyyy` - 29 Apr 2023

See [date-fns format documentation](https://date-fns.org/docs/format) for all available tokens.

## Styling

The component uses Tailwind CSS classes and can be customized via:

1. **className prop**: Add custom classes to the input trigger
2. **inputProps**: Pass additional props to the underlying Input component
3. **calendarProps**: Customize the calendar appearance

```tsx
<MRT_DatePicker
  className="w-full"
  inputProps={{ className: "border-primary" }}
  calendarProps={{ className: "rounded-lg" }}
/>
```

## Accessibility

- ✅ Keyboard navigation (Enter/Space to open)
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Screen reader compatible

## Integration with Table Filtering

The MRT_DatePicker is designed to work with the table's filtering system:

```tsx
const table = useMaterialReactTable({
  columns: [
    {
      accessorKey: 'date',
      header: 'Date',
      filterVariant: 'date',
      // The date picker will be automatically used for date filters
    },
  ],
  data,
});
```

## Migration from MUI DatePicker

If you're migrating from `@mui/x-date-pickers`:

**Before (MUI):**
```tsx
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    value={date}
    onChange={setDate}
    renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>
```

**After (shadcn/ui):**
```tsx
import { MRT_DatePicker } from 'material-react-table';

<MRT_DatePicker
  value={date}
  onChange={setDate}
/>
```

## Dependencies

- `react-day-picker` (^9.13.0) - Calendar component
- `date-fns` (^4.1.0) - Date formatting
- `lucide-react` - Calendar icon
- shadcn/ui components: Calendar, Popover, Input

## Related Components

- `MRT_DateRangePicker` - For selecting date ranges
- `MRT_FilterTextField` - General text input filtering
- `Calendar` (ui component) - Underlying calendar component
