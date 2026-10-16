import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MRT_ActionMenuItem } from '../MRT_ActionMenuItem';
import { Search } from 'lucide-react';

// Mock table instance
const mockTable = {
  options: {
    icons: {
      ArrowRightIcon: () => <span>→</span>,
    },
  },
} as any;

describe('MRT_ActionMenuItem', () => {
  it('should render menu item with icon and label', () => {
    render(
      <MRT_ActionMenuItem
        icon={<Search data-testid="search-icon" />}
        label="Search"
        table={mockTable}
      />
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    
    render(
      <MRT_ActionMenuItem
        icon={<Search />}
        label="Search"
        onClick={handleClick}
        table={mockTable}
      />
    );

    const menuItem = screen.getByText('Search').closest('[role="menuitem"]');
    if (menuItem) {
      fireEvent.click(menuItem);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <MRT_ActionMenuItem
        icon={<Search />}
        label="Search"
        disabled={true}
        table={mockTable}
      />
    );

    const menuItem = screen.getByText('Search').closest('[role="menuitem"]');
    expect(menuItem).toHaveAttribute('data-disabled', 'true');
  });

  it('should render divider when divider prop is true', () => {
    const { container } = render(
      <MRT_ActionMenuItem
        icon={<Search />}
        label="Search"
        divider={true}
        table={mockTable}
      />
    );

    // Check for separator element
    const separator = container.querySelector('[role="separator"]');
    expect(separator).toBeInTheDocument();
  });
});
