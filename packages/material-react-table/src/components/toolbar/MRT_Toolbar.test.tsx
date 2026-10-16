/**
 * Unit tests for toolbar components
 * 
 * Tests cover:
 * - Toolbar layout and spacing
 * - Alert banner variants
 * - Pagination controls
 * 
 * Validates Requirements: 1.7
 * 
 * Note: These tests verify the toolbar components' core functionality including
 * proper rendering, layout behavior, and user interactions.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MRT_TopToolbar } from './MRT_TopToolbar';
import { MRT_BottomToolbar } from './MRT_BottomToolbar';
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner';
import { MRT_TablePagination } from './MRT_TablePagination';
import type { MRT_TableInstance, MRT_RowData } from '../../types';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock UI components
vi.mock('../ui/alert', () => ({
  Alert: ({ children, variant, className, ...props }: any) => (
    <div data-testid="alert" data-variant={variant} className={className} {...props}>
      {children}
    </div>
  ),
  AlertTitle: ({ children }: any) => (
    <div data-testid="alert-title">{children}</div>
  ),
}));

vi.mock('../ui/collapsible', () => ({
  Collapsible: ({ children, open }: any) => (
    <div data-testid="collapsible" data-open={open}>
      {open && children}
    </div>
  ),
  CollapsibleContent: ({ children }: any) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
}));

vi.mock('../ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <div data-testid="select" data-value={value} data-disabled={disabled}>
      <button onClick={() => onValueChange?.('20')}>Change</button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className, id }: any) => (
    <div data-testid="select-trigger" className={className} id={id}>
      {children}
    </div>
  ),
  SelectValue: () => <span data-testid="select-value">Value</span>,
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, disabled }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('../buttons/MRT_IconButton', () => ({
  MRT_IconButton: ({ children, onClick, disabled, tooltip }: any) => (
    <button
      data-testid="icon-button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
    >
      {children}
    </button>
  ),
}));

// Mock other toolbar components
vi.mock('./MRT_LinearProgressBar', () => ({
  MRT_LinearProgressBar: ({ isTopToolbar }: any) => (
    <div data-testid="linear-progress" data-is-top={isTopToolbar} />
  ),
}));

vi.mock('./MRT_ToolbarDropZone', () => ({
  MRT_ToolbarDropZone: () => <div data-testid="toolbar-dropzone" />,
}));

vi.mock('./MRT_ToolbarInternalButtons', () => ({
  MRT_ToolbarInternalButtons: () => <div data-testid="toolbar-internal-buttons" />,
}));

vi.mock('../inputs/MRT_GlobalFilterTextField', () => ({
  MRT_GlobalFilterTextField: ({ className }: any) => (
    <input data-testid="global-filter" className={className} />
  ),
}));

vi.mock('../inputs/MRT_SelectCheckbox', () => ({
  MRT_SelectCheckbox: () => <input type="checkbox" data-testid="select-checkbox" />,
}));

vi.mock('../../hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(() => false),
}));

interface TestData extends MRT_RowData {
  id: number;
  name: string;
  email: string;
}

const createMockTable = (overrides?: any): Partial<MRT_TableInstance<TestData>> => {
  return {
    getState: vi.fn(() => ({
      isFullScreen: false,
      showGlobalFilter: false,
      showAlertBanner: false,
      density: 'comfortable',
      grouping: [],
      rowSelection: {},
      pagination: { pageIndex: 0, pageSize: 10 },
      ...overrides?.state,
    })) as any,
    getRowCount: vi.fn(() => 100),
    getPageCount: vi.fn(() => 10),
    firstPage: vi.fn(),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    lastPage: vi.fn(),
    setPageSize: vi.fn(),
    getFilteredSelectedRowModel: vi.fn(() => ({ rows: [], flatRows: [], rowsById: {} })),
    getCoreRowModel: vi.fn(() => ({ rows: new Array(100), flatRows: new Array(100), rowsById: {} })),
    getColumn: vi.fn((id: string) => ({
      columnDef: { header: id },
      toggleGrouping: vi.fn(),
    })),
    options: {
      enableGlobalFilter: false,
      enablePagination: true,
      enableToolbarInternalActions: true,
      enableRowSelection: false,
      enableSelectAll: false,
      positionGlobalFilter: 'right',
      positionPagination: 'bottom',
      positionToolbarAlertBanner: 'top',
      positionToolbarDropZone: 'top',
      paginationDisplayMode: 'default',
      manualPagination: false,
      id: 'test-table',
      icons: {
        ChevronLeftIcon: () => <span>←</span>,
        ChevronRightIcon: () => <span>→</span>,
        FirstPageIcon: () => <span>⇤</span>,
        LastPageIcon: () => <span>⇥</span>,
      },
      localization: {
        language: 'en',
        rowsPerPage: 'Rows per page',
        of: 'of',
        goToFirstPage: 'Go to first page',
        goToPreviousPage: 'Go to previous page',
        goToNextPage: 'Go to next page',
        goToLastPage: 'Go to last page',
        selectedCountOfRowCountRowsSelected: '{selectedCount} of {rowCount} row(s) selected',
        clearSelection: 'Clear selection',
        groupedBy: 'Grouped by',
        thenBy: ', then by',
      },
      mrtTheme: {
        baseBackgroundColor: '#ffffff',
      },
      ...overrides?.options,
    } as any,
    refs: {
      topToolbarRef: { current: null },
      bottomToolbarRef: { current: null },
      tablePaperRef: { current: { clientWidth: 800 } as any },
      ...overrides?.refs,
    } as any,
    ...overrides,
  };
};

describe('MRT_TopToolbar', () => {
  describe('Layout and Spacing', () => {
    it('should render with default layout', () => {
      const mockTable = createMockTable();
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveClass('grid', 'items-start', 'min-h-[3.5rem]');
    });

    it('should apply fullscreen positioning when isFullScreen is true', () => {
      const mockTable = createMockTable({
        state: { isFullScreen: true },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toHaveClass('sticky', 'top-0');
    });

    it('should render global filter when enabled and positioned left', () => {
      const mockTable = createMockTable({
        options: {
          enableGlobalFilter: true,
          positionGlobalFilter: 'left',
        },
        state: { showGlobalFilter: true },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('global-filter')).toBeInTheDocument();
    });

    it('should render global filter when enabled and positioned right', () => {
      const mockTable = createMockTable({
        options: {
          enableGlobalFilter: true,
          positionGlobalFilter: 'right',
        },
        state: { showGlobalFilter: true },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('global-filter')).toBeInTheDocument();
    });

    it('should render toolbar internal buttons when enabled', () => {
      const mockTable = createMockTable({
        options: { enableToolbarInternalActions: true },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('toolbar-internal-buttons')).toBeInTheDocument();
    });

    it('should render custom actions when provided', () => {
      const mockTable = createMockTable({
        options: {
          renderTopToolbarCustomActions: () => (
            <div data-testid="custom-actions">Custom Actions</div>
          ),
        },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('custom-actions')).toBeInTheDocument();
    });

    it('should render pagination when enabled and positioned top', () => {
      const mockTable = createMockTable({
        options: {
          enablePagination: true,
          positionPagination: 'top',
        },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });

    it('should render alert banner when positioned top', () => {
      const mockTable = createMockTable({
        options: { positionToolbarAlertBanner: 'top' },
        state: { showAlertBanner: true },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
    });

    it('should apply custom className from muiTopToolbarProps', () => {
      const mockTable = createMockTable({
        options: {
          muiTopToolbarProps: { className: 'custom-toolbar-class' },
        },
      });
      render(<MRT_TopToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toHaveClass('custom-toolbar-class');
    });
  });
});

describe('MRT_BottomToolbar', () => {
  describe('Layout and Spacing', () => {
    it('should render with default layout', () => {
      const mockTable = createMockTable();
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveClass('grid', 'items-start', 'min-h-[3.5rem]');
    });

    it('should apply fullscreen positioning when isFullScreen is true', () => {
      const mockTable = createMockTable({
        state: { isFullScreen: true },
      });
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
    });

    it('should render pagination when enabled and positioned bottom', () => {
      const mockTable = createMockTable({
        options: {
          enablePagination: true,
          positionPagination: 'bottom',
        },
      });
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });

    it('should render alert banner when positioned bottom', () => {
      const mockTable = createMockTable({
        options: { positionToolbarAlertBanner: 'bottom' },
        state: { showAlertBanner: true },
      });
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
    });

    it('should render custom actions when provided', () => {
      const mockTable = createMockTable({
        options: {
          renderBottomToolbarCustomActions: () => (
            <div data-testid="custom-bottom-actions">Custom Bottom Actions</div>
          ),
        },
      });
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      expect(screen.getByTestId('custom-bottom-actions')).toBeInTheDocument();
    });

    it('should apply custom className from muiBottomToolbarProps', () => {
      const mockTable = createMockTable({
        options: {
          muiBottomToolbarProps: { className: 'custom-bottom-toolbar' },
        },
      });
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toHaveClass('custom-bottom-toolbar');
    });

    it('should apply shadow styling', () => {
      const mockTable = createMockTable();
      render(<MRT_BottomToolbar table={mockTable as MRT_TableInstance<TestData>} />);
      
      const toolbar = screen.getByTestId('linear-progress').parentElement;
      expect(toolbar).toHaveClass('shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2)_inset]');
    });
  });
});

describe('MRT_ToolbarAlertBanner', () => {
  describe('Alert Banner Variants', () => {
    it('should render with default variant', () => {
      const mockTable = createMockTable();
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toBeInTheDocument();
    });

    it('should render with destructive variant', () => {
      const mockTable = createMockTable({
        state: { showAlertBanner: true },
      });
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
          variant="destructive"
        />
      );
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-variant', 'destructive');
    });

    it('should display custom title', () => {
      const mockTable = createMockTable({
        state: { showAlertBanner: true },
      });
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
          title="Custom Alert Title"
        />
      );
      
      expect(screen.getByTestId('alert-title')).toHaveTextContent('Custom Alert Title');
    });

    it('should display custom children content', () => {
      const mockTable = createMockTable({
        state: { showAlertBanner: true },
      });
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        >
          <div data-testid="custom-content">Custom Content</div>
        </MRT_ToolbarAlertBanner>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should show selected row count when rows are selected', () => {
      const mockTable = createMockTable({
        options: { enableRowSelection: true },
        state: { rowSelection: { '0': true, '1': true } },
      });
      mockTable.getFilteredSelectedRowModel = vi.fn(() => ({ rows: new Array(2), flatRows: new Array(2), rowsById: {} }));
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(screen.getByText(/2 of 100 row\(s\) selected/)).toBeInTheDocument();
    });

    it('should show clear selection button when rows are selected', () => {
      const mockTable = createMockTable({
        options: { enableRowSelection: true },
        state: { rowSelection: { '0': true } },
      });
      mockTable.getFilteredSelectedRowModel = vi.fn(() => ({ rows: new Array(1), flatRows: new Array(1), rowsById: {} }));
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const clearButton = screen.getByText('Clear selection');
      expect(clearButton).toBeInTheDocument();
    });

    it('should show grouping information when columns are grouped', () => {
      const mockTable = createMockTable({
        state: { grouping: ['name', 'email'] },
      });
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(screen.getByText('Grouped by')).toBeInTheDocument();
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('email')).toBeInTheDocument();
    });

    it('should render select checkbox when enableSelectAll and head-overlay position', () => {
      const mockTable = createMockTable({
        options: {
          enableRowSelection: true,
          enableSelectAll: true,
          positionToolbarAlertBanner: 'head-overlay',
        },
        state: { rowSelection: { '0': true } },
      });
      mockTable.getFilteredSelectedRowModel = vi.fn(() => ({ rows: new Array(1), flatRows: new Array(1), rowsById: {} }));
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(screen.getByTestId('select-checkbox')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const mockTable = createMockTable({
        state: { showAlertBanner: true },
      });
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
          className="custom-alert-class"
        />
      );
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('custom-alert-class');
    });

    it('should be collapsible based on showAlertBanner state', () => {
      const mockTable = createMockTable({
        state: { showAlertBanner: false },
      });
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-open', 'false');
    });

    it('should open collapsible when showAlertBanner is true', () => {
      const mockTable = createMockTable({
        state: { showAlertBanner: true },
      });
      
      render(
        <MRT_ToolbarAlertBanner
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-open', 'true');
    });
  });
});

describe('MRT_TablePagination', () => {
  describe('Pagination Controls', () => {
    it('should render pagination with default settings', () => {
      const mockTable = createMockTable();
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(screen.getByText('Rows per page')).toBeInTheDocument();
      expect(screen.getByText('1-10 of 100')).toBeInTheDocument();
    });

    it('should display correct page info text', () => {
      const mockTable = createMockTable({
        state: { pagination: { pageIndex: 2, pageSize: 10 } },
      });
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(screen.getByText('21-30 of 100')).toBeInTheDocument();
    });

    it('should call nextPage when next button is clicked', async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const nextButton = buttons.find(btn => btn.textContent?.includes('→'));
      
      await user.click(nextButton!);
      expect(mockTable.nextPage).toHaveBeenCalled();
    });

    it('should call previousPage when previous button is clicked', async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable({
        state: { pagination: { pageIndex: 1, pageSize: 10 } },
      });
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const prevButton = buttons.find(btn => btn.textContent?.includes('←'));
      
      await user.click(prevButton!);
      expect(mockTable.previousPage).toHaveBeenCalled();
    });

    it('should call firstPage when first page button is clicked', async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable({
        state: { pagination: { pageIndex: 5, pageSize: 10 } },
      });
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          showFirstButton={true}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const firstButton = buttons.find(btn => btn.textContent?.includes('⇤'));
      
      await user.click(firstButton!);
      expect(mockTable.firstPage).toHaveBeenCalled();
    });

    it('should call lastPage when last page button is clicked', async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          showLastButton={true}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const lastButton = buttons.find(btn => btn.textContent?.includes('⇥'));
      
      await user.click(lastButton!);
      expect(mockTable.lastPage).toHaveBeenCalled();
    });

    it('should disable back buttons on first page', () => {
      const mockTable = createMockTable({
        state: { pagination: { pageIndex: 0, pageSize: 10 } },
      });
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          showFirstButton={true}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const prevButton = buttons.find(btn => btn.textContent?.includes('←'));
      const firstButton = buttons.find(btn => btn.textContent?.includes('⇤'));
      
      expect(prevButton).toBeDisabled();
      expect(firstButton).toBeDisabled();
    });

    it('should disable forward buttons on last page', () => {
      const mockTable = createMockTable({
        state: { pagination: { pageIndex: 9, pageSize: 10 } },
      });
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          showLastButton={true}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const nextButton = buttons.find(btn => btn.textContent?.includes('→'));
      const lastButton = buttons.find(btn => btn.textContent?.includes('⇥'));
      
      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });

    it('should render rows per page selector', () => {
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          showRowsPerPage={true}
        />
      );
      
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    it('should hide rows per page selector when showRowsPerPage is false', () => {
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          showRowsPerPage={false}
        />
      );
      
      expect(screen.queryByText('Rows per page')).not.toBeInTheDocument();
    });

    it('should call setPageSize when page size is changed', async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const changeButton = screen.getByText('Change');
      await user.click(changeButton);
      
      expect(mockTable.setPageSize).toHaveBeenCalledWith(20);
    });

    it('should render custom rowsPerPageOptions', () => {
      const mockTable = createMockTable();
      const customOptions = [
        { label: 'Five', value: 5 },
        { label: 'Ten', value: 10 },
      ];
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          rowsPerPageOptions={customOptions}
        />
      );
      
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
    });

    it('should disable all controls when disabled prop is true', () => {
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          disabled={true}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should apply custom className', () => {
      const mockTable = createMockTable();
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
          className="custom-pagination-class"
        />
      );
      
      const pagination = screen.getByText('Rows per page').parentElement;
      expect(pagination).toHaveClass('custom-pagination-class');
    });

    it('should show first/last buttons when more than 2 pages', () => {
      const mockTable = createMockTable();
      mockTable.getPageCount = vi.fn(() => 5);
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      const buttons = screen.getAllByTestId('icon-button');
      const firstButton = buttons.find(btn => btn.textContent?.includes('⇤'));
      const lastButton = buttons.find(btn => btn.textContent?.includes('⇥'));
      
      expect(firstButton).toBeInTheDocument();
      expect(lastButton).toBeInTheDocument();
    });

    it('should not render when paginationDisplayMode is not default', () => {
      const mockTable = createMockTable({
        options: { paginationDisplayMode: 'pages' as any },
      });
      
      const { container } = render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('should handle zero rows correctly', () => {
      const mockTable = createMockTable();
      mockTable.getRowCount = vi.fn(() => 0);
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      expect(screen.getByText('0-0 of 0')).toBeInTheDocument();
    });

    it('should format numbers according to localization', () => {
      const mockTable = createMockTable();
      mockTable.getRowCount = vi.fn(() => 1000);
      
      render(
        <MRT_TablePagination
          table={mockTable as MRT_TableInstance<TestData>}
        />
      );
      
      // Numbers should be formatted with locale
      expect(screen.getByText(/1-10 of 1,000/)).toBeInTheDocument();
    });
  });
});
