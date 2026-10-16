import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MRT_DateRangePicker } from '../../src/components/inputs/MRT_DateRangePicker';
import { DateRange } from 'react-day-picker';

const meta: Meta<typeof MRT_DateRangePicker> = {
  title: 'Features/Date Range Picker',
  component: MRT_DateRangePicker,
  parameters: {
    docs: {
      description: {
        component:
          'The MRT_DateRangePicker component provides date range selection functionality using react-day-picker and shadcn/ui Calendar. It includes preset buttons for common date ranges and integrates seamlessly with the table filtering system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MRT_DateRangePicker>;

export const Default: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <div className="p-4">
        <MRT_DateRangePicker value={dateRange} onChange={setDateRange} />
        {dateRange?.from && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm">
              Selected range: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <div className="p-4">
        <MRT_DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="Choose a date range"
        />
      </div>
    );
  },
};

export const WithInitialValue: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date('2024-01-15'),
      to: new Date('2024-01-20'),
    });
    return (
      <div className="p-4">
        <MRT_DateRangePicker value={dateRange} onChange={setDateRange} />
        {dateRange?.from && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm">
              Selected range: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const WithCustomFormat: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <div className="p-4">
        <MRT_DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          dateFormat="MM/dd/yyyy"
          placeholder="MM/DD/YYYY - MM/DD/YYYY"
        />
        {dateRange?.from && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm">
              Selected range: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(),
    });
    return (
      <div className="p-4">
        <MRT_DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          disabled
        />
      </div>
    );
  },
};

export const WithMinMaxDates: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return (
      <div className="p-4">
        <MRT_DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select range (current month only)"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Only dates in the current month can be selected
        </p>
      </div>
    );
  },
};

export const WithoutPresets: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <div className="p-4">
        <MRT_DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          showPresets={false}
        />
        {dateRange?.from && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm">
              Selected range: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const PresetButtons: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <div className="p-4">
        <MRT_DateRangePicker value={dateRange} onChange={setDateRange} />
        {dateRange?.from && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm font-medium mb-2">Selected range:</p>
            <p className="text-sm">
              From: {dateRange.from.toLocaleDateString()}
            </p>
            {dateRange.to && (
              <p className="text-sm">To: {dateRange.to.toLocaleDateString()}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Try clicking the preset buttons like "Last 7 days" or "This month"
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const InFilterContext: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range Filter</label>
          <MRT_DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Filter by date range"
          />
        </div>
        {dateRange?.from && dateRange?.to && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm font-medium mb-1">Active Filter:</p>
            <p className="text-sm">
              Showing records from {dateRange.from.toLocaleDateString()} to{' '}
              {dateRange.to.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const MultipleRangePickers: Story = {
  render: () => {
    const [createdRange, setCreatedRange] = useState<DateRange | undefined>();
    const [modifiedRange, setModifiedRange] = useState<
      DateRange | undefined
    >();

    return (
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Created Date Range</label>
          <MRT_DateRangePicker
            value={createdRange}
            onChange={setCreatedRange}
            placeholder="Filter by creation date"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Modified Date Range</label>
          <MRT_DateRangePicker
            value={modifiedRange}
            onChange={setModifiedRange}
            placeholder="Filter by modification date"
          />
        </div>
        {(createdRange?.from || modifiedRange?.from) && (
          <div className="mt-4 p-3 bg-secondary rounded-md space-y-2">
            <p className="text-sm font-medium">Active Filters:</p>
            {createdRange?.from && createdRange?.to && (
              <p className="text-sm">
                Created: {createdRange.from.toLocaleDateString()} -{' '}
                {createdRange.to.toLocaleDateString()}
              </p>
            )}
            {modifiedRange?.from && modifiedRange?.to && (
              <p className="text-sm">
                Modified: {modifiedRange.from.toLocaleDateString()} -{' '}
                {modifiedRange.to.toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
};
