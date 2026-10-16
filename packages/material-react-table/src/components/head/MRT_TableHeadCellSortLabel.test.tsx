import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MRT_TableHeadCellSortLabel } from './MRT_TableHeadCellSortLabel';
import type { MRT_Header, MRT_TableInstance } from '../../types';

// Mock the icon components
vi.mock('lucide-react', () => ({
  ArrowDown: () => <span data-testid="arrow-down-icon">ArrowDown</span>,
  ArrowUp: () => <span data-testid="arrow-up-icon">ArrowUp</span>,
  ArrowUpDown: () => <span data-testid="arrow-up-down-icon">ArrowUpDown</span>,
}));

describe('MRT_TableHeadCellSortLabel', () => {
  const mockGetToggleSortingHandler = vi.fn(() => vi.fn());

  const createMockTable = (
    sortState: false | 'asc' | 'desc' = false,
    sortingLength = 1,
    sortIndex = 0,
  ): MRT_TableInstance<any> =>
    ({
      getState: () => ({
        isLoading: false,
        showSkeletons: false,
        sorting: Array(sortingLength).fill({}),
      }),
      options: {
        icons: {
          ArrowDownwardIcon: () => (
            <span data-testid="arrow-down-icon">ArrowDown</span>
          ),
          ArrowUpwardIcon: () => (
            <span data-testid="arrow-up-icon">ArrowUp</span>
          ),
          SyncAltIcon: () => (
            <span data-testid="arrow-up-down-icon">ArrowUpDown</span>
          ),
        },
        localization: {
          sortByColumnAsc: 'Sort by {column} ascending',
          sortByColumnDesc: 'Sort by {column} descending',
          sortedByColumnAsc: 'Sorted by {column} ascending',
          sortedByColumnDesc: 'Sorted by {column} descending',
        },
      },
    }) as any;

  const createMockHeader = (
    sortState: false | 'asc' | 'desc' = false,
    sortIndex = 0,
  ): MRT_Header<any> =>
    ({
      column: {
        columnDef: {
          header: 'Test Column',
        },
        getIsSorted: () => sortState,
        getNextSortingOrder: () => (sortState === 'asc' ? 'desc' : 'asc'),
        getSortIndex: () => sortIndex,
        getToggleSortingHandler: mockGetToggleSortingHandler,
      },
    }) as any;

  it('should render unsorted icon when column is not sorted', () => {
    const table = createMockTable(false);
    const header = createMockHeader(false);

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    expect(screen.getByTestId('arrow-up-down-icon')).toBeInTheDocument();
  });

  it('should render ascending icon when column is sorted ascending', () => {
    const table = createMockTable('asc');
    const header = createMockHeader('asc');

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument();
  });

  it('should render descending icon when column is sorted descending', () => {
    const table = createMockTable('desc');
    const header = createMockHeader('desc');

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
  });

  it('should show sort index badge when multiple columns are sorted', () => {
    const table = createMockTable('asc', 3, 1);
    const header = createMockHeader('asc', 1);

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    // Sort index should be displayed (sortIndex + 1 = 2)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should not show sort index badge when only one column is sorted', () => {
    const table = createMockTable('asc', 1, 0);
    const header = createMockHeader('asc', 0);

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    // No badge should be displayed
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('should call toggle sorting handler when clicked', async () => {
    const user = userEvent.setup();
    const table = createMockTable(false);
    const header = createMockHeader(false);

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockGetToggleSortingHandler).toHaveBeenCalled();
  });

  it('should have correct aria-label for unsorted column', () => {
    const table = createMockTable(false);
    const header = createMockHeader(false);

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Sort by Test Column ascending',
    );
  });

  it('should have correct aria-label for sorted ascending column', () => {
    const table = createMockTable('asc');
    const header = createMockHeader('asc');

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Sorted by Test Column ascending',
    );
  });

  it('should have correct aria-label for sorted descending column', () => {
    const table = createMockTable('desc');
    const header = createMockHeader('desc');

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Sorted by Test Column descending',
    );
  });

  it('should apply custom className', () => {
    const table = createMockTable(false);
    const header = createMockHeader(false);

    render(
      <MRT_TableHeadCellSortLabel
        header={header}
        table={table}
        className="custom-class"
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have lower opacity when unsorted', () => {
    const table = createMockTable(false);
    const header = createMockHeader(false);

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-30');
  });

  it('should have full opacity when sorted', () => {
    const table = createMockTable('asc');
    const header = createMockHeader('asc');

    render(<MRT_TableHeadCellSortLabel header={header} table={table} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-100');
  });
});
