/**
 * Unit tests for MRT_Button component
 * Validates Requirements 1.7, 14.1
 * 
 * Tests verify that:
 * 1. MRT_Button wraps shadcn/ui Button correctly
 * 2. MUI variant names are mapped to shadcn/ui equivalents
 * 3. startIcon and endIcon props work correctly
 * 4. Custom className and other props are passed through
 * 5. Backward compatibility with MUI Button patterns is maintained
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MRT_Button } from './MRT_Button';
import { Search, X } from 'lucide-react';

describe('MRT_Button component', () => {
  it('should render as a button element', () => {
    render(<MRT_Button>Click me</MRT_Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('should render children text', () => {
    render(<MRT_Button>Test Button</MRT_Button>);
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should apply default variant when no variant is specified', () => {
    const { container } = render(<MRT_Button>Default</MRT_Button>);
    
    const button = container.querySelector('button');
    // Default variant has bg-primary class
    expect(button?.className).toContain('bg-primary');
  });

  it('should map MUI "contained" variant to shadcn "default" variant', () => {
    const { container } = render(<MRT_Button variant="contained">Contained</MRT_Button>);
    
    const button = container.querySelector('button');
    // Default variant has bg-primary class
    expect(button?.className).toContain('bg-primary');
  });

  it('should map MUI "outlined" variant to shadcn "outline" variant', () => {
    const { container } = render(<MRT_Button variant="outlined">Outlined</MRT_Button>);
    
    const button = container.querySelector('button');
    // Outline variant has border class
    expect(button?.className).toContain('border');
    expect(button?.className).toContain('border-input');
  });

  it('should map MUI "text" variant to shadcn "ghost" variant', () => {
    const { container } = render(<MRT_Button variant="text">Text</MRT_Button>);
    
    const button = container.querySelector('button');
    // Ghost variant has hover:bg-accent class
    expect(button?.className).toContain('hover:bg-accent');
  });

  it('should support shadcn/ui native variants', () => {
    const { container } = render(<MRT_Button variant="destructive">Delete</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-destructive');
  });

  it('should support secondary variant', () => {
    const { container } = render(<MRT_Button variant="secondary">Secondary</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-secondary');
  });

  it('should support link variant', () => {
    const { container } = render(<MRT_Button variant="link">Link</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('underline-offset-4');
  });

  it('should render startIcon before children', () => {
    const { container } = render(
      <MRT_Button startIcon={<Search data-testid="search-icon" />}>
        Search
      </MRT_Button>
    );
    
    const button = container.querySelector('button');
    const icon = screen.getByTestId('search-icon');
    const text = screen.getByText('Search');
    
    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    
    // Icon should come before text in DOM order
    const buttonChildren = Array.from(button?.childNodes || []);
    const iconIndex = buttonChildren.findIndex(node => 
      node instanceof HTMLElement && node.contains(icon)
    );
    const textIndex = buttonChildren.findIndex(node => 
      node.textContent?.includes('Search')
    );
    
    expect(iconIndex).toBeLessThan(textIndex);
  });

  it('should render endIcon after children', () => {
    const { container } = render(
      <MRT_Button endIcon={<X data-testid="close-icon" />}>
        Close
      </MRT_Button>
    );
    
    const button = container.querySelector('button');
    const icon = screen.getByTestId('close-icon');
    const text = screen.getByText('Close');
    
    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    
    // Text should come before icon in DOM order
    const buttonChildren = Array.from(button?.childNodes || []);
    const textIndex = buttonChildren.findIndex(node => 
      node.textContent?.includes('Close')
    );
    const iconIndex = buttonChildren.findIndex(node => 
      node instanceof HTMLElement && node.contains(icon)
    );
    
    expect(textIndex).toBeLessThan(iconIndex);
  });

  it('should render both startIcon and endIcon', () => {
    render(
      <MRT_Button 
        startIcon={<Search data-testid="start-icon" />}
        endIcon={<X data-testid="end-icon" />}
      >
        Button Text
      </MRT_Button>
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('Button Text')).toBeInTheDocument();
  });

  it('should add gap class when startIcon is present', () => {
    const { container } = render(
      <MRT_Button startIcon={<Search />}>Search</MRT_Button>
    );
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('gap-2');
  });

  it('should add gap class when endIcon is present', () => {
    const { container } = render(
      <MRT_Button endIcon={<X />}>Close</MRT_Button>
    );
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('gap-2');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MRT_Button className="custom-class">Custom</MRT_Button>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <MRT_Button className="my-custom-class" variant="outline">
        Custom
      </MRT_Button>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('my-custom-class');
    expect(button?.className).toContain('border');
  });

  it('should handle disabled state', () => {
    render(<MRT_Button disabled>Disabled</MRT_Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should apply disabled styling', () => {
    const { container } = render(<MRT_Button disabled>Disabled</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('disabled:pointer-events-none');
    expect(button?.className).toContain('disabled:opacity-50');
  });

  it('should handle onClick event', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    render(<MRT_Button onClick={handleClick}>Click</MRT_Button>);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(clicked).toBe(true);
  });

  it('should pass through other HTML button attributes', () => {
    render(
      <MRT_Button 
        type="submit" 
        aria-label="Submit form"
        data-testid="submit-button"
      >
        Submit
      </MRT_Button>
    );
    
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('should support size prop', () => {
    const { container } = render(<MRT_Button size="sm">Small</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-8');
    expect(button?.className).toContain('text-xs');
  });

  it('should support large size', () => {
    const { container } = render(<MRT_Button size="lg">Large</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-10');
  });

  it('should support icon size', () => {
    const { container } = render(
      <MRT_Button size="icon">
        <Search />
      </MRT_Button>
    );
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-9');
    expect(button?.className).toContain('w-9');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLButtonElement | null };
    
    render(
      <MRT_Button ref={ref}>
        Ref Button
      </MRT_Button>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Ref Button');
  });

  it('should render with asChild prop', () => {
    const { container } = render(
      <MRT_Button asChild>
        <a href="/test">Link Button</a>
      </MRT_Button>
    );
    
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should handle complex children with icons', () => {
    render(
      <MRT_Button startIcon={<Search />}>
        <span>Complex</span>
        <span>Children</span>
      </MRT_Button>
    );
    
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('should maintain button base classes', () => {
    const { container } = render(<MRT_Button>Base</MRT_Button>);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('inline-flex');
    expect(button?.className).toContain('items-center');
    expect(button?.className).toContain('justify-center');
    expect(button?.className).toContain('rounded-md');
    expect(button?.className).toContain('text-sm');
    expect(button?.className).toContain('font-medium');
  });
});
