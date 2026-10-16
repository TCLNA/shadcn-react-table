/**
 * Unit tests for MRT_EditRowModal component
 * 
 * Tests cover:
 * - Modal opening/closing
 * - Form submission
 * - Cancel behavior
 * 
 * Validates Requirements: 1.7
 * 
 * Note: These tests verify the modal component's core functionality including
 * proper rendering, event handling, and integration with the table instance.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MRT_EditRowModal } from './MRT_EditRowModal';
import type { MRT_TableInstance, MRT_Row, MRT_RowData } from '../../types';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock the UI components
vi.mock('../ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {open && children}
      <button onClick={() => onOpenChange(false)}>Close Dialog</button>
    </div>
  ),
  DialogContent: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children, className }: any) => (
    <h2 data-testid="dialog-title" className={className}>
      {children}
    </h2>
  ),
  DialogFooter: ({ children, className }: any) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

// Mock the edit action buttons
vi.mock('../buttons/MRT_EditActionButtons', () => ({
  MRT_EditActionButtons: ({ row, table }: any) => (
    <div data-testid="edit-action-buttons">
      <button
        data-testid="cancel-button"
        onClick={() => {
          const { creatingRow, editingRow } = table.getState();
          if (creatingRow) {
            table.options.onCreatingRowCancel?.({ row, table });
            table.setCreatingRow(null);
          } else {
            table.options.onEditingRowCancel?.({ row, table });
            table.setEditingRow(null);
          }
        }}
      >
        Cancel
      </button>
      <button
        data-testid="save-button"
        onClick={() => {
          const { creatingRow } = table.getState();
          if (creatingRow) {
            table.options.onCreatingRowSave?.({ row, table });
          } else {
            table.options.onEditingRowSave?.({ row, table });
          }
        }}
      >
        Save
      </button>
    </div>
  ),
}));

// Mock the edit cell text field
vi.mock('../inputs/MRT_EditCellTextField', () => ({
  MRT_EditCellTextField: ({ cell }: any) => (
    <input
      data-testid={`edit-input-${cell.column.id}`}
      defaultValue={cell.getValue()}
    />
  ),
}));

interface TestData extends MRT_RowData {
  id: number;
  name: string;
  email: string;
}

describe('MRT_EditRowModal', () => {
  let mockTable: Partial<MRT_TableInstance<TestData>>;
  let mockRow: Partial<MRT_Row<TestData>>;
  let mockOnOpenChange: ReturnType<typeof vi.fn>;
  let mockOnCreatingRowCancel: ReturnType<typeof vi.fn>;
  let mockOnEditingRowCancel: ReturnType<typeof vi.fn>;
  let mockOnCreatingRowSave: ReturnType<typeof vi.fn>;
  let mockOnEditingRowSave: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnOpenChange = vi.fn();
    mockOnCreatingRowCancel = vi.fn();
    mockOnEditingRowCancel = vi.fn();
    mockOnCreatingRowSave = vi.fn();
    mockOnEditingRowSave = vi.fn();

    // Create mock cells
    const mockCells = [
      {
        id: 'name',
        column: {
          id: 'name',
          columnDef: {
            columnDefType: 'data',
            header: 'Name',
            accessorKey: 'name',
          },
        },
        getValue: () => 'John Doe',
      },
      {
        id: 'email',
        column: {
          id: 'email',
          columnDef: {
            columnDefType: 'data',
            header: 'Email',
            accessorKey: 'email',
          },
        },
        getValue: () => 'john@example.com',
      },
    ];

    mockRow = {
      id: 'row-1',
      original: { id: 1, name: 'John Doe', email: 'john@example.com' },
      _valuesCache: {},
      getAllCells: vi.fn(() => mockCells as any),
    };

    mockTable = {
      getState: vi.fn(() => ({
        creatingRow: null,
        editingRow: mockRow as MRT_Row<TestData>,
      })),
      setCreatingRow: vi.fn(),
      setEditingRow: vi.fn(),
      options: {
        localization: {
          edit: 'Edit',
          cancel: 'Cancel',
          save: 'Save',
        },
        onCreatingRowCancel: mockOnCreatingRowCancel,
        onEditingRowCancel: mockOnEditingRowCancel,
        onCreatingRowSave: mockOnCreatingRowSave,
        onEditingRowSave: mockOnEditingRowSave,
      },
    };
  });

  describe('Modal Opening/Closing', () => {
    it('should render modal when open is true', () => {
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });

    it('should not render modal content when open is false', () => {
      render(
        <MRT_EditRowModal
          open={false}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false');
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    });

    it('should display edit title from localization', () => {
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Edit');
    });

    it('should call onOpenChange when dialog is closed', async () => {
      const user = userEvent.setup();
      
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const closeButton = screen.getByText('Close Dialog');
      await user.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should render edit inputs for data columns', () => {
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('edit-input-name')).toBeInTheDocument();
      expect(screen.getByTestId('edit-input-email')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
          className="custom-modal-class"
        />
      );

      const dialogContent = screen.getByTestId('dialog-content');
      expect(dialogContent.className).toContain('custom-modal-class');
    });
  });

  describe('Cancel Behavior', () => {
    it('should call onEditingRowCancel when cancel is clicked in edit mode', async () => {
      const user = userEvent.setup();
      
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(mockOnEditingRowCancel).toHaveBeenCalledWith({
        row: mockRow,
        table: mockTable,
      });
    });

    it('should call setEditingRow(null) when cancel is clicked in edit mode', async () => {
      const user = userEvent.setup();
      
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(mockTable.setEditingRow).toHaveBeenCalledWith(null);
    });

    it('should call onCreatingRowCancel when cancel is clicked in create mode', async () => {
      const user = userEvent.setup();
      
      // Update mock to be in creating mode
      mockTable.getState = vi.fn(() => ({
        creatingRow: mockRow as MRT_Row<TestData>,
        editingRow: null,
      }));

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(mockOnCreatingRowCancel).toHaveBeenCalledWith({
        row: mockRow,
        table: mockTable,
      });
    });

    it('should call setCreatingRow(null) when cancel is clicked in create mode', async () => {
      const user = userEvent.setup();
      
      // Update mock to be in creating mode
      mockTable.getState = vi.fn(() => ({
        creatingRow: mockRow as MRT_Row<TestData>,
        editingRow: null,
      }));

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(mockTable.setCreatingRow).toHaveBeenCalledWith(null);
    });

    it('should reset row values cache when closing dialog', async () => {
      const user = userEvent.setup();
      
      // Set some cached values
      mockRow._valuesCache = { name: 'Modified Name' };

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const closeButton = screen.getByText('Close Dialog');
      await user.click(closeButton);

      // The values cache should be reset
      expect(mockRow._valuesCache).toEqual({});
    });

    it('should call onOpenChange when closing via cancel', async () => {
      const user = userEvent.setup();
      
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const closeButton = screen.getByText('Close Dialog');
      await user.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Form Submission', () => {
    it('should call onEditingRowSave when save is clicked in edit mode', async () => {
      const user = userEvent.setup();
      
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      expect(mockOnEditingRowSave).toHaveBeenCalledWith({
        row: mockRow,
        table: mockTable,
      });
    });

    it('should call onCreatingRowSave when save is clicked in create mode', async () => {
      const user = userEvent.setup();
      
      // Update mock to be in creating mode
      mockTable.getState = vi.fn(() => ({
        creatingRow: mockRow as MRT_Row<TestData>,
        editingRow: null,
      }));

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      expect(mockOnCreatingRowSave).toHaveBeenCalledWith({
        row: mockRow,
        table: mockTable,
      });
    });

    it('should render action buttons in the footer', () => {
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const footer = screen.getByTestId('dialog-footer');
      const actionButtons = screen.getByTestId('edit-action-buttons');
      
      expect(footer).toContainElement(actionButtons);
    });
  });

  describe('Custom Render Functions', () => {
    it('should use renderEditRowDialogContent when provided', () => {
      const customRender = vi.fn(() => (
        <div data-testid="custom-edit-content">Custom Edit Content</div>
      ));

      mockTable.options = {
        ...mockTable.options,
        renderEditRowDialogContent: customRender,
      };

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('custom-edit-content')).toBeInTheDocument();
      expect(customRender).toHaveBeenCalledWith({
        internalEditComponents: expect.any(Array),
        row: mockRow,
        table: mockTable,
      });
    });

    it('should use renderCreateRowDialogContent when in create mode', () => {
      const customRender = vi.fn(() => (
        <div data-testid="custom-create-content">Custom Create Content</div>
      ));

      mockTable.getState = vi.fn(() => ({
        creatingRow: mockRow as MRT_Row<TestData>,
        editingRow: null,
      }));

      mockTable.options = {
        ...mockTable.options,
        renderCreateRowDialogContent: customRender,
      };

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('custom-create-content')).toBeInTheDocument();
      expect(customRender).toHaveBeenCalledWith({
        internalEditComponents: expect.any(Array),
        row: mockRow,
        table: mockTable,
      });
    });

    it('should prioritize renderCreateRowDialogContent over renderEditRowDialogContent in create mode', () => {
      const createRender = vi.fn(() => (
        <div data-testid="custom-create-content">Custom Create</div>
      ));
      const editRender = vi.fn(() => (
        <div data-testid="custom-edit-content">Custom Edit</div>
      ));

      mockTable.getState = vi.fn(() => ({
        creatingRow: mockRow as MRT_Row<TestData>,
        editingRow: null,
      }));

      mockTable.options = {
        ...mockTable.options,
        renderCreateRowDialogContent: createRender,
        renderEditRowDialogContent: editRender,
      };

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByTestId('custom-create-content')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-edit-content')).not.toBeInTheDocument();
      expect(createRender).toHaveBeenCalled();
      expect(editRender).not.toHaveBeenCalled();
    });
  });

  describe('Dialog Props', () => {
    it('should merge muiEditRowDialogProps', () => {
      mockTable.options = {
        ...mockTable.options,
        muiEditRowDialogProps: {
          className: 'custom-dialog-class',
        },
      };

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const dialogContent = screen.getByTestId('dialog-content');
      expect(dialogContent.className).toContain('custom-dialog-class');
    });

    it('should merge muiCreateRowModalProps in create mode', () => {
      mockTable.getState = vi.fn(() => ({
        creatingRow: mockRow as MRT_Row<TestData>,
        editingRow: null,
      }));

      mockTable.options = {
        ...mockTable.options,
        muiCreateRowModalProps: {
          className: 'custom-create-class',
        },
      };

      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const dialogContent = screen.getByTestId('dialog-content');
      expect(dialogContent.className).toContain('custom-create-class');
    });

    it('should apply default max-w-md class', () => {
      render(
        <MRT_EditRowModal
          open={true}
          table={mockTable as MRT_TableInstance<TestData>}
          onOpenChange={mockOnOpenChange}
        />
      );

      const dialogContent = screen.getByTestId('dialog-content');
      expect(dialogContent.className).toContain('max-w-md');
    });
  });
});
