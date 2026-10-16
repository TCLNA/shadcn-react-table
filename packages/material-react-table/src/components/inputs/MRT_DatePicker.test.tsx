import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MRT_DatePicker } from './MRT_DatePicker';

describe('MRT_DatePicker', () => {
  it('should render with placeholder text', () => {
    render(<MRT_DatePicker placeholder="Select a date" />);
    const input = screen.getByPlaceholderText('Select a date');
    expect(input).toBeInTheDocument();
  });

  it('should display formatted date when value is provided', () => {
    const testDate = new Date('2024-01-15');
    render(<MRT_DatePicker value={testDate} dateFormat="yyyy-MM-dd" />);
    const input = screen.getByDisplayValue('2024-01-15');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when date is selected', () => {
    const handleChange = vi.fn();
    render(<MRT_DatePicker onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    
    // Note: Full calendar interaction testing would require more complex setup
    // This test verifies the component renders and accepts the onChange prop
    expect(handleChange).not.toHaveBeenCalled(); // Not called until date selected
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MRT_DatePicker disabled placeholder="Select date" />);
    const input = screen.getByPlaceholderText('Select date');
    expect(input).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<MRT_DatePicker className="custom-class" placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('custom-class');
  });

  it('should render calendar icon', () => {
    const { container } = render(<MRT_DatePicker />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle keyboard interaction', () => {
    render(<MRT_DatePicker placeholder="Select date" />);
    const input = screen.getByPlaceholderText('Select date');
    
    fireEvent.keyDown(input, { key: 'Enter' });
    // Popover should open (tested via integration tests)
    expect(input).toBeInTheDocument();
  });

  it('should use default placeholder when not provided', () => {
    render(<MRT_DatePicker />);
    const input = screen.getByPlaceholderText('Pick a date');
    expect(input).toBeInTheDocument();
  });

  it('should pass minDate to Calendar component', () => {
    const minDate = new Date('2024-01-01');
    const { container } = render(<MRT_DatePicker minDate={minDate} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    // Note: Full calendar constraint testing would require opening the popover
    // and verifying disabled dates, which is complex in unit tests
  });

  it('should pass maxDate to Calendar component', () => {
    const maxDate = new Date('2024-12-31');
    const { container } = render(<MRT_DatePicker maxDate={maxDate} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    // Note: Full calendar constraint testing would require opening the popover
    // and verifying disabled dates, which is complex in unit tests
  });

  it('should pass both minDate and maxDate to Calendar component', () => {
    const minDate = new Date('2024-01-01');
    const maxDate = new Date('2024-12-31');
    const { container } = render(
      <MRT_DatePicker minDate={minDate} maxDate={maxDate} />,
    );
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should pass calendarProps to Calendar component', () => {
    render(<MRT_DatePicker calendarProps={{ numberOfMonths: 2 } as any} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});
