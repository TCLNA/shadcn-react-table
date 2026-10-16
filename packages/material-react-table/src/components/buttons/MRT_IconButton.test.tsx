import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search, X } from 'lucide-react';
import { MRT_IconButton } from './MRT_IconButton';

describe('MRT_IconButton', () => {
  it('should render with default variant and size', () => {
    render(
      <MRT_IconButton aria-label="search">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-9', 'w-9');
  });

  it('should render with ghost variant by default', () => {
    render(
      <MRT_IconButton aria-label="search">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    // Ghost variant has hover:bg-accent class
    expect(button.className).toContain('hover:bg-accent');
  });

  it('should apply custom variant', () => {
    render(
      <MRT_IconButton aria-label="delete" variant="destructive">
        <X />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'delete' });
    // Destructive variant has bg-destructive class
    expect(button.className).toContain('bg-destructive');
  });

  it('should apply small size', () => {
    render(
      <MRT_IconButton aria-label="search" size="small">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toHaveClass('h-8', 'w-8');
  });

  it('should apply large size', () => {
    render(
      <MRT_IconButton aria-label="search" size="large">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('should apply compact density', () => {
    render(
      <MRT_IconButton aria-label="search" density="compact">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toHaveClass('h-8', 'w-8');
  });

  it('should apply spacious density', () => {
    render(
      <MRT_IconButton aria-label="search" density="spacious">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('should apply comfortable density (default size)', () => {
    render(
      <MRT_IconButton aria-label="search" density="comfortable">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toHaveClass('h-9', 'w-9');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <MRT_IconButton aria-label="search" onClick={handleClick}>
        <Search />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'search' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <MRT_IconButton aria-label="search" disabled>
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toBeDisabled();
  });

  it('should not trigger click when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <MRT_IconButton aria-label="search" onClick={handleClick} disabled>
        <Search />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'search' });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <MRT_IconButton aria-label="search" className="custom-class">
        <Search />
      </MRT_IconButton>,
    );
    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toHaveClass('custom-class');
  });

  it('should render with tooltip when tooltip prop is provided', async () => {
    const user = userEvent.setup();

    render(
      <MRT_IconButton aria-label="search" tooltip="Search items">
        <Search />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toBeInTheDocument();

    // Hover to show tooltip
    await user.hover(button);

    // Wait for tooltip to appear
    const tooltip = await screen.findByText('Search items');
    expect(tooltip).toBeInTheDocument();
  });

  it('should show tooltip on disabled button', async () => {
    const user = userEvent.setup();

    render(
      <MRT_IconButton
        aria-label="search"
        tooltip="Search is disabled"
        disabled
      >
        <Search />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toBeDisabled();

    // The button is wrapped in a span when disabled with tooltip
    const wrapper = button.parentElement;
    expect(wrapper?.tagName).toBe('SPAN');

    // Hover to show tooltip
    await user.hover(wrapper!);

    // Wait for tooltip to appear
    const tooltip = await screen.findByText('Search is disabled');
    expect(tooltip).toBeInTheDocument();
  });

  it('should support different tooltip placements', async () => {
    const user = userEvent.setup();

    render(
      <MRT_IconButton
        aria-label="search"
        tooltip="Search items"
        tooltipPlacement="right"
      >
        <Search />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'search' });
    await user.hover(button);

    const tooltip = await screen.findByText('Search items');
    expect(tooltip).toBeInTheDocument();
    // Note: Testing exact placement requires more complex setup with Radix UI Portal
  });

  it('should render icon children correctly', () => {
    render(
      <MRT_IconButton aria-label="close">
        <X data-testid="x-icon" />
      </MRT_IconButton>,
    );

    const icon = screen.getByTestId('x-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should forward ref to button element', () => {
    const ref = vi.fn();

    render(
      <MRT_IconButton ref={ref} aria-label="search">
        <Search />
      </MRT_IconButton>,
    );

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
  });

  it('should support aria-label for accessibility', () => {
    render(
      <MRT_IconButton aria-label="Clear filter">
        <X />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Clear filter' });
    expect(button).toHaveAttribute('aria-label', 'Clear filter');
  });

  it('should maintain button type attribute', () => {
    render(
      <MRT_IconButton aria-label="submit" type="submit">
        <Search />
      </MRT_IconButton>,
    );

    const button = screen.getByRole('button', { name: 'submit' });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
