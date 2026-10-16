import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MRT_DatePicker } from '../../src/components/inputs/MRT_DatePicker';

const meta: Meta<typeof MRT_DatePicker> = {
  title: 'Features/Date Picker',
  component: MRT_DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'The MRT_DatePicker component provides date selection functionality using react-day-picker and shadcn/ui Calendar. It integrates seamlessly with the table filtering system for date-based filtering.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MRT_DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="p-4">
        <MRT_DatePicker value={date} onChange={setDate} />
        {date && (
          <p className="mt-4 text-sm">
            Selected date: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="p-4">
        <MRT_DatePicker
          value={date}
          onChange={setDate}
          placeholder="Choose a date"
        />
      </div>
    );
  },
};

export const WithInitialValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date('2024-01-15'));
    return (
      <div className="p-4">
        <MRT_DatePicker value={date} onChange={setDate} />
        {date && (
          <p className="mt-4 text-sm">
            Selected date: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
};

export const WithCustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="p-4">
        <MRT_DatePicker
          value={date}
          onChange={setDate}
          dateFormat="MM/dd/yyyy"
          placeholder="MM/DD/YYYY"
        />
        {date && (
          <p className="mt-4 text-sm">
            Selected date: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="p-4">
        <MRT_DatePicker value={date} onChange={setDate} disabled />
      </div>
    );
  },
};

export const WithMinMaxDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return (
      <div className="p-4">
        <MRT_DatePicker
          value={date}
          onChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select date (current month only)"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Only dates in the current month can be selected
        </p>
      </div>
    );
  },
};

export const InFilterContext: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    return (
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <MRT_DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="From"
            maxDate={endDate}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <MRT_DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="To"
            minDate={startDate}
          />
        </div>
        {startDate && endDate && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm">
              Date range: {startDate.toLocaleDateString()} -{' '}
              {endDate.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    );
  },
};
