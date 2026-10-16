/**
 * Unit tests for MRT_TableLoadingOverlay component
 * Validates Requirements 1.7
 * 
 * Tests verify that:
 * 1. Loading overlay renders with Loader2 icon from lucide-react
 * 2. Overlay has correct styling (backdrop blur, positioning, z-index)
 * 3. Accessibility attributes are properly set (aria-label from localization)
 * 4. Custom Component can be provided via muiCircularProgressProps
 * 5. Props can be provided as function or object
 * 6. Custom className and HTML attributes are applied correctly
 * 7. Overlay positioning and visual effects work correctly
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Loader2 } from 'lucide-react';
import { MRT_TableLoadingOverlay } from './MRT_TableLoadingOverlay';
import type { MRT_TableInstance } from '../../types';

describe('MRT_TableLoadingOverlay', () => {
  const mockTable = {
    options: {
      id: 'test-table',
      localization: {
        noRecordsToDisplay: 'Loading...',
      },
      muiCircularProgressProps: undefined,
    },
  } as unknown as MRT_TableInstance<any>;

  it('should render loading overlay with Loader2 icon', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    // Check overlay container exists with correct classes
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('absolute', 'inset-0', 'flex', 'items-center', 'justify-center');
    expect(overlay).toHaveClass('bg-background/50', 'backdrop-blur-sm');

    // Check Loader2 icon is rendered
    const loader = overlay.querySelector('svg');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} className="custom-class" />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('custom-class');
  });

  it('should use correct aria-label from localization', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const loader = container.querySelector('svg');
    expect(loader).toHaveAttribute('aria-label', 'Loading...');
  });

  it('should use correct id based on table id', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const loader = container.querySelector('svg');
    expect(loader).toHaveAttribute('id', 'mrt-progress-test-table');
  });

  it('should render custom Component when provided via muiCircularProgressProps', () => {
    const CustomComponent = () => <div data-testid="custom-loader">Custom</div>;
    const tableWithCustomComponent = {
      ...mockTable,
      options: {
        ...mockTable.options,
        muiCircularProgressProps: { Component: <CustomComponent /> },
      },
    } as unknown as MRT_TableInstance<any>;

    render(<MRT_TableLoadingOverlay table={tableWithCustomComponent} />);

    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('should support muiCircularProgressProps as function', () => {
    const CustomComponent = () => <div data-testid="custom-loader-fn">Custom Function</div>;
    const tableWithFunction = {
      ...mockTable,
      options: {
        ...mockTable.options,
        muiCircularProgressProps: () => ({ Component: <CustomComponent /> }),
      },
    } as unknown as MRT_TableInstance<any>;

    render(<MRT_TableLoadingOverlay table={tableWithFunction} />);

    expect(screen.getByTestId('custom-loader-fn')).toBeInTheDocument();
  });

  it('should pass through additional HTML attributes', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay
        table={mockTable}
        data-testid="loading-overlay"
        role="status"
      />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute('data-testid', 'loading-overlay');
    expect(overlay).toHaveAttribute('role', 'status');
  });

  it('should have correct z-index for overlay positioning', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('z-[3]');
  });

  it('should have backdrop blur effect', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });

  it('should have semi-transparent background', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('bg-background/50');
  });

  it('should center content with flexbox', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should have full width and max-height', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('w-full', 'max-h-screen');
  });

  it('should apply primary color to Loader2 icon', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const loader = container.querySelector('svg');
    expect(loader?.className).toContain('text-primary');
  });

  it('should have correct icon size', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    const loader = container.querySelector('svg');
    expect(loader?.className).toContain('h-8');
    expect(loader?.className).toContain('w-8');
  });

  it('should merge className from muiCircularProgressProps', () => {
    const tableWithClassName = {
      ...mockTable,
      options: {
        ...mockTable.options,
        muiCircularProgressProps: {
          className: 'custom-overlay-class',
        },
      },
    } as unknown as MRT_TableInstance<any>;

    const { container } = render(
      <MRT_TableLoadingOverlay table={tableWithClassName} />,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('custom-overlay-class');
  });

  it('should not render Component prop if it is not provided', () => {
    const { container } = render(
      <MRT_TableLoadingOverlay table={mockTable} />,
    );

    // Should render default Loader2 icon
    const loader = container.querySelector('svg');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin');
  });
});
