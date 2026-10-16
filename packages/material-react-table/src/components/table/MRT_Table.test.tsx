/**
 * Unit tests for MRT_Table component migration
 * Validates Requirements 1.7, 14.1
 * 
 * Tests verify that:
 * 1. MRT_Table renders as a native <table> element (not MUI Table)
 * 2. Tailwind classes are applied correctly
 * 3. Sticky header functionality works with Tailwind classes
 * 4. Layout mode (grid) is applied correctly
 * 5. Column size CSS variables are set
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MRT_Table } from './MRT_Table';
import type { MRT_TableInstance, MRT_RowData } from '../../types';

// Mock child components
vi.mock('../head/MRT_TableHead', () => ({
  MRT_TableHead: () => <thead data-testid="table-head" />,
}));

vi.mock('../body/MRT_TableBody', () => ({
  MRT_TableBody: () => <tbody data-testid="table-body" />,
  Memo_MRT_TableBody: () => <tbody data-testid="memo-table-body" />,
}));

vi.mock('../footer/MRT_TableFooter', () => ({
  MRT_TableFooter: () => <tfoot data-testid="table-footer" />,
}));

vi.mock('../../hooks/useMRT_ColumnVirtualizer', () => ({
  useMRT_ColumnVirtualizer: () => null,
}));

// Create a minimal mock table instance
function createMockTable(options: Partial<any> = {}): MRT_TableInstance<any> {
  return {
    getFlatHeaders: vi.fn(() => [
      {
        id: 'col1',
        column: { id: 'col1' },
        getSize: () => 100,
      },
      {
        id: 'col2',
        column: { id: 'col2' },
        getSize: () => 150,
      },
    ]),
    getState: vi.fn(() => ({
      columnSizing: {},
      columnSizingInfo: { isResizingColumn: false },
      columnVisibility: {},
      isFullScreen: false,
      ...options.state,
    })),
    options: {
      columns: [],
      enableStickyHeader: false,
      enableTableFooter: false,
      enableTableHead: true,
      layoutMode: 'semantic',
      memoMode: 'cells',
      muiTableProps: undefined,
      renderCaption: undefined,
      ...options.options,
    },
  } as any;
}

describe('MRT_Table component', () => {
  it('should render as a native table element', () => {
    const table = createMockTable();
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    expect(tableElement).toBeInTheDocument();
  });

  it('should apply Tailwind base classes', () => {
    const table = createMockTable();
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    expect(tableElement).toHaveClass('w-full');
    expect(tableElement).toHaveClass('caption-bottom');
    expect(tableElement).toHaveClass('text-sm');
    expect(tableElement).toHaveClass('border-separate');
    expect(tableElement).toHaveClass('relative');
  });

  it('should apply sticky header classes when enableStickyHeader is true', () => {
    const table = createMockTable({
      options: { enableStickyHeader: true },
    });
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    // Check for sticky header class pattern
    expect(tableElement?.className).toContain('[&_thead]:sticky');
    expect(tableElement?.className).toContain('[&_thead]:top-0');
    expect(tableElement?.className).toContain('[&_thead]:z-10');
  });

  it('should apply sticky header classes when isFullScreen is true', () => {
    const table = createMockTable({
      state: { isFullScreen: true },
    });
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    expect(tableElement?.className).toContain('[&_thead]:sticky');
  });

  it('should apply grid display class when layoutMode starts with "grid"', () => {
    const table = createMockTable({
      options: { layoutMode: 'grid' },
    });
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    expect(tableElement).toHaveClass('grid');
  });

  it('should not apply grid class for semantic layout mode', () => {
    const table = createMockTable({
      options: { layoutMode: 'semantic' },
    });
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    expect(tableElement).not.toHaveClass('grid');
  });

  it('should set column size CSS variables in style', () => {
    const table = createMockTable();
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    const style = tableElement?.getAttribute('style');
    
    expect(style).toContain('--header-col1-size');
    expect(style).toContain('--col-col1-size');
    expect(style).toContain('--header-col2-size');
    expect(style).toContain('--col-col2-size');
  });

  it('should render table head when enableTableHead is true', () => {
    const table = createMockTable({
      options: { enableTableHead: true },
    });
    const { getByTestId } = render(<MRT_Table table={table} />);
    
    expect(getByTestId('table-head')).toBeInTheDocument();
  });

  it('should not render table head when enableTableHead is false', () => {
    const table = createMockTable({
      options: { enableTableHead: false },
    });
    const { queryByTestId } = render(<MRT_Table table={table} />);
    
    expect(queryByTestId('table-head')).not.toBeInTheDocument();
  });

  it('should render table footer when enableTableFooter is true', () => {
    const table = createMockTable({
      options: { enableTableFooter: true },
    });
    const { getByTestId } = render(<MRT_Table table={table} />);
    
    expect(getByTestId('table-footer')).toBeInTheDocument();
  });

  it('should render memoized table body when memoMode is "table-body"', () => {
    const table = createMockTable({
      options: { memoMode: 'table-body' },
    });
    const { getByTestId } = render(<MRT_Table table={table} />);
    
    expect(getByTestId('memo-table-body')).toBeInTheDocument();
  });

  it('should render memoized table body when isResizingColumn is true', () => {
    const table = createMockTable({
      state: { columnSizingInfo: { isResizingColumn: true } },
    });
    const { getByTestId } = render(<MRT_Table table={table} />);
    
    expect(getByTestId('memo-table-body')).toBeInTheDocument();
  });

  it('should render regular table body by default', () => {
    const table = createMockTable();
    const { getByTestId } = render(<MRT_Table table={table} />);
    
    expect(getByTestId('table-body')).toBeInTheDocument();
  });

  it('should render caption when renderCaption is provided', () => {
    const table = createMockTable({
      options: {
        renderCaption: () => 'Test Caption',
      },
    });
    const { container } = render(<MRT_Table table={table} />);
    
    const caption = container.querySelector('caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent('Test Caption');
    expect(caption).toHaveClass('mt-4');
    expect(caption).toHaveClass('text-sm');
    expect(caption).toHaveClass('text-muted-foreground');
  });

  it('should apply custom className prop', () => {
    const table = createMockTable();
    const { container } = render(
      <MRT_Table table={table} className="custom-class" />
    );
    
    const tableElement = container.querySelector('table');
    expect(tableElement).toHaveClass('custom-class');
  });

  it('should apply custom style prop', () => {
    const table = createMockTable();
    const { container } = render(
      <MRT_Table table={table} style={{ borderColor: 'red' }} />
    );
    
    const tableElement = container.querySelector('table');
    const style = tableElement?.getAttribute('style');
    expect(style).toContain('border-color: red');
  });

  it('should merge muiTableProps with component props', () => {
    const table = createMockTable({
      options: {
        muiTableProps: {
          className: 'mui-class',
          'data-testid': 'mui-table',
        },
      },
    });
    const { container } = render(<MRT_Table table={table} />);
    
    const tableElement = container.querySelector('table');
    expect(tableElement).toHaveClass('mui-class');
    expect(tableElement).toHaveAttribute('data-testid', 'mui-table');
  });

  it('should handle muiTableProps as a function', () => {
    const muiTablePropsFn = vi.fn(() => ({
      className: 'dynamic-class',
    }));
    
    const table = createMockTable({
      options: {
        muiTableProps: muiTablePropsFn,
      },
    });
    
    const { container } = render(<MRT_Table table={table} />);
    
    expect(muiTablePropsFn).toHaveBeenCalledWith({ table });
    const tableElement = container.querySelector('table');
    expect(tableElement).toHaveClass('dynamic-class');
  });
});
