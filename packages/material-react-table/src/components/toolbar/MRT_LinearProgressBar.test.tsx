/**
 * Unit tests for MRT_LinearProgressBar component
 * Validates Requirements 1.7
 * 
 * Tests verify that:
 * 1. Progress bar renders correctly when showProgressBars or isSaving is true
 * 2. Progress bar is hidden when both showProgressBars and isSaving are false
 * 3. Positioning works correctly for top and bottom toolbars
 * 4. Accessibility attributes are properly set (aria-busy, aria-label)
 * 5. Indeterminate state is supported
 * 6. Custom className and props are applied correctly
 * 7. Props from table options (muiLinearProgressProps) are merged correctly
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MRT_LinearProgressBar } from './MRT_LinearProgressBar';
import type { MRT_TableInstance } from '../../types';

describe('MRT_LinearProgressBar', () => {
  const mockTable = {
    getState: vi.fn(() => ({
      isSaving: false,
      showProgressBars: true,
    })),
    options: {
      muiLinearProgressProps: undefined,
    },
  } as unknown as MRT_TableInstance<any>;

  it('should render progress bar when showProgressBars is true', () => {
    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={mockTable} />
    );
    
    // Check that the progress bar is rendered
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should render progress bar when isSaving is true', () => {
    const savingTable = {
      ...mockTable,
      getState: vi.fn(() => ({
        isSaving: true,
        showProgressBars: false,
      })),
    } as unknown as MRT_TableInstance<any>;

    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={savingTable} />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should not render progress bar when showProgressBars is false and not saving', () => {
    const hiddenTable = {
      ...mockTable,
      getState: vi.fn(() => ({
        isSaving: false,
        showProgressBars: false,
      })),
    } as unknown as MRT_TableInstance<any>;

    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={hiddenTable} />
    );
    
    // Progress bar should not be visible
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('should position at bottom when isTopToolbar is true', () => {
    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={mockTable} />
    );
    
    const wrapper = container.querySelector('.bottom-0');
    expect(wrapper).toBeInTheDocument();
  });

  it('should position at top when isTopToolbar is false', () => {
    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={false} table={mockTable} />
    );
    
    const wrapper = container.querySelector('.top-0');
    expect(wrapper).toBeInTheDocument();
  });

  it('should have aria-busy and aria-label attributes', () => {
    render(<MRT_LinearProgressBar isTopToolbar={true} table={mockTable} />);
    
    const progressBar = screen.getByLabelText('Loading');
    expect(progressBar).toHaveAttribute('aria-busy', 'true');
  });

  it('should support indeterminate state', () => {
    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={mockTable} />
    );
    
    // Check that the progress indicator has the indeterminate animation class
    const indicator = container.querySelector('.animate-progress-indeterminate');
    expect(indicator).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MRT_LinearProgressBar
        isTopToolbar={true}
        table={mockTable}
        className="custom-progress"
      />
    );
    
    const progressBar = container.querySelector('.custom-progress');
    expect(progressBar).toBeInTheDocument();
  });

  it('should merge muiLinearProgressProps from table options', () => {
    const propsTable = {
      ...mockTable,
      options: {
        muiLinearProgressProps: {
          className: 'from-options',
        },
      },
    } as unknown as MRT_TableInstance<any>;

    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={propsTable} />
    );
    
    const progressBar = container.querySelector('.from-options');
    expect(progressBar).toBeInTheDocument();
  });

  it('should support muiLinearProgressProps as function', () => {
    const propsTable = {
      ...mockTable,
      options: {
        muiLinearProgressProps: ({ isTopToolbar }: any) => ({
          className: isTopToolbar ? 'top-toolbar-class' : 'bottom-toolbar-class',
        }),
      },
    } as unknown as MRT_TableInstance<any>;

    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={propsTable} />
    );
    
    const progressBar = container.querySelector('.top-toolbar-class');
    expect(progressBar).toBeInTheDocument();
  });

  it('should merge className from props with muiLinearProgressProps', () => {
    const propsTable = {
      ...mockTable,
      options: {
        muiLinearProgressProps: {
          className: 'from-options',
        },
      },
    } as unknown as MRT_TableInstance<any>;

    const { container } = render(
      <MRT_LinearProgressBar
        isTopToolbar={true}
        table={propsTable}
        className="from-props"
      />
    );
    
    const progressBar = container.querySelector('.from-options.from-props');
    expect(progressBar).toBeInTheDocument();
  });

  it('should have correct height styling', () => {
    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={mockTable} />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar?.className).toContain('h-1');
  });

  it('should be positioned relatively within absolute wrapper', () => {
    const { container } = render(
      <MRT_LinearProgressBar isTopToolbar={true} table={mockTable} />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar?.className).toContain('relative');
  });
});
