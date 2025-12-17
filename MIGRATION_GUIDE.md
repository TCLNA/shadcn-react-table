# Migration Guide: Material UI to shadcn UI with Base UI

This guide covers the migration from Material UI (MUI) components to shadcn UI using Base UI components in shadcn-react-table.

## Overview

The shadcn-react-table project is migrating from Material UI to shadcn UI design system. Instead of using Radix UI primitives (which shadcn typically uses), we're using Base UI components from `@base-ui/react` as the underlying primitives. This provides better compatibility with React Server Components and offers a lighter-weight alternative while maintaining the shadcn design aesthetic.

## Breaking Changes

### Component Prop Changes

#### 1. Menu Components

**Before (MUI):**
```tsx
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  MenuListProps={{ dense: true }}
>
  <MenuItem onClick={handleClick}>Item</MenuItem>
</Menu>
```

**After (Base UI with shadcn styling):**
```tsx
import * as Menu from '@base-ui/react/Menu';

<Menu.Root open={Boolean(anchorEl)} onOpenChange={(open) => !open && handleClose()}>
  <Menu.Positioner anchorEl={anchorEl}>
    <Menu.Popup className="menu-popup">
      <Menu.Item onClick={handleClick} className="menu-item">
        Item
      </Menu.Item>
    </Menu.Popup>
  </Menu.Positioner>
</Menu.Root>
```

#### 2. Dialog/Modal Components

**Before (MUI):**
```tsx
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
  <DialogTitle>Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>Actions</DialogActions>
</Dialog>
```

**After (Base UI with shadcn styling):**
```tsx
import * as Dialog from '@base-ui/react/Dialog';

<Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
  <Dialog.Portal>
    <Dialog.Backdrop className="dialog-backdrop" />
    <Dialog.Popup className="dialog-popup">
      <Dialog.Title className="dialog-title">Title</Dialog.Title>
      <div className="dialog-content">Content</div>
      <div className="dialog-actions">Actions</div>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

#### 3. Tooltip Components

**Before (MUI):**
```tsx
import Tooltip from '@mui/material/Tooltip';

<Tooltip title="Tooltip text" placement="top">
  <IconButton>Icon</IconButton>
</Tooltip>
```

**After (Base UI with shadcn styling):**
```tsx
import * as Tooltip from '@base-ui/react/Tooltip';

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button>Icon</button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup className="tooltip-popup">
          Tooltip text
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

#### 4. Select/Dropdown Components

**Before (MUI):**
```tsx
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

<Select value={value} onChange={handleChange}>
  <MenuItem value="option1">Option 1</MenuItem>
  <MenuItem value="option2">Option 2</MenuItem>
</Select>
```

**After (Base UI with shadcn styling):**
```tsx
import * as Select from '@base-ui/react/Select';

<Select.Root value={value} onValueChange={handleChange}>
  <Select.Trigger className="select-trigger">
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup className="select-popup">
        <Select.Item value="option1" className="select-item">
          Option 1
        </Select.Item>
        <Select.Item value="option2" className="select-item">
          Option 2
        </Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

### Styling Changes

#### CSS Variables (shadcn Design Tokens)

The following CSS variables are now used throughout the component library:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

#### Component-specific Classes

Base UI components use className-based styling instead of MUI's `sx` prop:

```tsx
// Before (MUI with sx prop)
<Menu
  MenuListProps={{
    sx: { backgroundColor: 'background.paper', padding: '8px' }
  }}
/>

// After (Base UI with className)
<Menu.Popup className="rounded-md border bg-popover p-2 text-popover-foreground shadow-md" />
```

### Type Changes

#### Event Handlers

Base UI uses different event signatures:

```tsx
// Before (MUI)
onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void

// After (Base UI)
onOpenChange?: (open: boolean, event?: Event) => void
```

#### Component References

```tsx
// Before (MUI)
import { MenuProps } from '@mui/material/Menu';

// After (Base UI)
import type { MenuRootProps } from '@base-ui/react/Menu';
```

## Migration Steps

### 1. Install Dependencies

```bash
pnpm add @base-ui/react
```

### 2. Remove MUI Dependencies (Optional)

If fully migrating away from MUI:

```bash
pnpm remove @mui/material @mui/icons-material @emotion/react @emotion/styled
```

Note: You may want to keep some MUI packages if using them for other components not yet migrated.

### 3. Update Component Imports

Replace MUI imports with Base UI equivalents across your codebase.

### 4. Apply shadcn Styling

Add the global CSS variables to your application's CSS file and apply className-based styling to all Base UI components.

### 5. Update Tests

Update component tests to account for new DOM structure and class names:

```tsx
// Before
const menuItem = screen.getByRole('menuitem', { name: 'Item' });

// After  
const menuItem = screen.getByRole('menuitem', { name: 'Item' });
// Note: Base UI maintains ARIA roles, but DOM structure differs
```

### 6. Test Interactive Behaviors

Thoroughly test:
- Menu open/close behavior
- Dialog backdrop clicks and escape key
- Tooltip show/hide on hover
- Keyboard navigation in dropdowns
- Focus management

## Common Issues and Solutions

### Issue: Menu doesn't position correctly

**Solution:** Ensure you're using `Menu.Positioner` with the correct `anchorEl` prop:

```tsx
<Menu.Positioner 
  anchorEl={anchorEl}
  side="bottom"
  align="start"
>
  <Menu.Popup>...</Menu.Popup>
</Menu.Positioner>
```

### Issue: Dialog doesn't close on backdrop click

**Solution:** Use the `onOpenChange` prop instead of `onClose`:

```tsx
<Dialog.Root 
  open={open} 
  onOpenChange={(isOpen) => {
    if (!isOpen) handleClose();
  }}
>
```

### Issue: Tooltips flicker on hover

**Solution:** Wrap tooltip groups in a `Tooltip.Provider` to share hover state:

```tsx
<Tooltip.Provider>
  {/* Multiple tooltips here */}
</Tooltip.Provider>
```

### Issue: Custom styling not applied

**Solution:** Ensure you're using className instead of sx prop, and that CSS variables are defined:

```tsx
// Wrong
<Menu.Popup sx={{ backgroundColor: 'red' }} />

// Correct
<Menu.Popup className="bg-red-500" />
```

## Additional Resources

- [Base UI Documentation](https://base-ui.com/)
- [shadcn UI Documentation](https://ui.shadcn.com/)
- [shadcn-react-table Examples](./examples)

## Support

If you encounter issues during migration, please:
1. Check this guide for common solutions
2. Review the [Base UI documentation](https://base-ui.com/)
3. Open an issue on the [GitHub repository](https://github.com/TCLNA/shadcn-react-table/issues)
