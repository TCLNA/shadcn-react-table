# MRT_IconButton Migration Notes

## Overview

The `MRT_IconButton` component is a wrapper around shadcn/ui's `Button` component configured for icon-only usage. It replaces MUI's `IconButton` component and provides integrated tooltip support, which is a common pattern in the codebase.

## Component Mapping

**Before (MUI):**
```tsx
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';

<Tooltip title="Search">
  <span>
    <IconButton
      aria-label="search"
      onClick={handleSearch}
      disabled={!canSearch}
      size="small"
    >
      <SearchIcon />
    </IconButton>
  </span>
</Tooltip>
```

**After (shadcn/ui):**
```tsx
import { MRT_IconButton } from './components/buttons/MRT_IconButton';
import { Search } from 'lucide-react';

<MRT_IconButton
  aria-label="search"
  onClick={handleSearch}
  disabled={!canSearch}
  size="small"
  tooltip="Search"
>
  <Search />
</MRT_IconButton>
```

## Key Differences

### 1. Integrated Tooltip Support

The most significant improvement is built-in tooltip support. Instead of wrapping the button in a separate `Tooltip` component, you can pass the `tooltip` prop directly:

```tsx
// MUI pattern (verbose)
<Tooltip title="Delete">
  <span>
    <IconButton onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  </span>
</Tooltip>

// MRT_IconButton pattern (concise)
<MRT_IconButton onClick={handleDelete} tooltip="Delete">
  <Trash2 />
</MRT_IconButton>
```

### 2. Tooltip Placement

Control tooltip position with the `tooltipPlacement` prop:

```tsx
<MRT_IconButton
  tooltip="Filter options"
  tooltipPlacement="right"
>
  <Filter />
</MRT_IconButton>
```

Available placements: `'top'` (default), `'right'`, `'bottom'`, `'left'`

### 3. Size Variants

The component supports three size variants:

- `'icon'` (default): 36px × 36px (h-9 w-9)
- `'small'`: 32px × 32px (h-8 w-8)
- `'large'`: 40px × 40px (h-10 w-10)

```tsx
<MRT_IconButton size="small" tooltip="Clear">
  <X />
</MRT_IconButton>
```

### 4. Density Support

For table context, use the `density` prop to automatically adjust button size:

- `'compact'`: Maps to `size="small"`
- `'comfortable'`: Maps to `size="icon"` (default)
- `'spacious'`: Maps to `size="large"`

```tsx
<MRT_IconButton density="compact" tooltip="Expand">
  <ChevronDown />
</MRT_IconButton>
```

### 5. Variant Support

While the default variant is `'ghost'` (transparent background with hover effect), you can use other variants:

```tsx
<MRT_IconButton variant="destructive" tooltip="Delete">
  <Trash2 />
</MRT_IconButton>

<MRT_IconButton variant="outline" tooltip="Settings">
  <Settings />
</MRT_IconButton>
```

Available variants:
- `'ghost'` (default): Transparent with hover effect
- `'default'`: Primary background
- `'destructive'`: Destructive/danger styling
- `'outline'`: Border with transparent background
- `'secondary'`: Secondary background
- `'link'`: Link-style button

### 6. Disabled State with Tooltips

The component handles disabled buttons with tooltips correctly by wrapping them in a span:

```tsx
<MRT_IconButton
  disabled={!canDelete}
  tooltip="Delete is disabled"
>
  <Trash2 />
</MRT_IconButton>
```

This ensures the tooltip still shows even when the button is disabled (MUI required manual span wrapping).

## Icon Migration

Icons are migrated from `@mui/icons-material` to `lucide-react`:

| MUI Icon | lucide-react Icon |
|----------|-------------------|
| `SearchIcon` | `Search` |
| `CloseIcon` | `X` |
| `FilterListIcon` | `Filter` |
| `DeleteIcon` | `Trash2` |
| `EditIcon` | `Pencil` |
| `MoreVertIcon` | `MoreVertical` |
| `ExpandMoreIcon` | `ChevronDown` |
| `ChevronRightIcon` | `ChevronRight` |
| `AddIcon` | `Plus` |
| `RemoveIcon` | `Minus` |
| `VisibilityIcon` | `Eye` |
| `VisibilityOffIcon` | `EyeOff` |
| `ContentCopyIcon` | `Copy` |
| `FullscreenIcon` | `Maximize` |
| `FullscreenExitIcon` | `Minimize` |
| `DragIndicatorIcon` | `GripVertical` |

## Styling

### Custom Classes

Apply custom Tailwind classes via the `className` prop:

```tsx
<MRT_IconButton
  className="text-blue-500 hover:text-blue-700"
  tooltip="Custom styled button"
>
  <Star />
</MRT_IconButton>
```

### Size Customization

The component uses Tailwind classes for sizing. The default sizes are:
- Small: `h-8 w-8`
- Icon (default): `h-9 w-9`
- Large: `h-10 w-10`

You can override with custom classes if needed:

```tsx
<MRT_IconButton className="h-12 w-12" tooltip="Extra large">
  <Search />
</MRT_IconButton>
```

## Common Patterns

### Filter Clear Button

```tsx
// Before (MUI)
<Tooltip placement="right" title={localization.clearFilter}>
  <span>
    <IconButton
      aria-label={localization.clearFilter}
      disabled={!filterValue?.toString()?.length}
      onClick={handleClear}
      size="small"
      sx={{ height: '2rem', width: '2rem' }}
    >
      <CloseIcon />
    </IconButton>
  </span>
</Tooltip>

// After (MRT_IconButton)
<MRT_IconButton
  aria-label={localization.clearFilter}
  disabled={!filterValue?.toString()?.length}
  onClick={handleClear}
  size="small"
  tooltip={localization.clearFilter}
  tooltipPlacement="right"
>
  <X />
</MRT_IconButton>
```

### Toolbar Action Button

```tsx
// Before (MUI)
<Tooltip title="Create New User">
  <IconButton onClick={handleCreateNewUser}>
    <AddBoxIcon />
  </IconButton>
</Tooltip>

// After (MRT_IconButton)
<MRT_IconButton
  onClick={handleCreateNewUser}
  tooltip="Create New User"
>
  <Plus />
</MRT_IconButton>
```

### Row Action Button

```tsx
// Before (MUI)
<IconButton onClick={() => table.setEditingRow(row)}>
  <Edit />
</IconButton>

// After (MRT_IconButton)
<MRT_IconButton
  onClick={() => table.setEditingRow(row)}
  tooltip="Edit row"
>
  <Pencil />
</MRT_IconButton>
```

## Accessibility

The component maintains full accessibility support:

- Always provide `aria-label` for screen readers
- Tooltips are properly associated with buttons
- Disabled state is correctly communicated
- Keyboard navigation works as expected

```tsx
<MRT_IconButton
  aria-label="Delete selected items"
  tooltip="Delete"
  onClick={handleDelete}
>
  <Trash2 />
</MRT_IconButton>
```

## TypeScript Support

The component is fully typed with TypeScript:

```tsx
import { type MRT_IconButtonProps } from './components/buttons/MRT_IconButton';

const CustomIconButton: React.FC<MRT_IconButtonProps> = (props) => {
  return <MRT_IconButton {...props} />;
};
```

## Performance Considerations

- The component uses `React.useMemo` for size calculations to avoid unnecessary re-renders
- Tooltip is only rendered when the `tooltip` prop is provided
- The component forwards refs correctly for optimal React performance

## Migration Checklist

When migrating from MUI IconButton to MRT_IconButton:

- [ ] Replace `IconButton` import with `MRT_IconButton`
- [ ] Replace MUI icon imports with lucide-react equivalents
- [ ] Remove separate `Tooltip` wrapper components
- [ ] Add `tooltip` prop to MRT_IconButton
- [ ] Remove manual `<span>` wrappers for disabled buttons
- [ ] Update `size` prop if using custom sizes (remove `sx` prop)
- [ ] Add `aria-label` for accessibility if not present
- [ ] Test tooltip behavior on hover
- [ ] Test disabled state with tooltips
- [ ] Verify icon sizing matches original design

## Known Limitations

1. **No sx prop**: The component uses Tailwind classes instead of MUI's `sx` prop. Use `className` for custom styling.

2. **Tooltip delay**: The shadcn/ui Tooltip has a default delay. This matches MUI's behavior but may differ slightly in timing.

3. **Icon sizing**: lucide-react icons are sized via the `[&_svg]:size-4` class in the button. Override with custom classes if needed.

## Related Components

- `MRT_Button`: For text buttons with optional icons
- `Button` (shadcn/ui): The underlying button component
- `Tooltip` (shadcn/ui): The underlying tooltip component

## Requirements Validated

- **Requirement 1.7**: Component maintains MRT_ prefix naming convention
- **Requirement 14.8**: Replaces MUI IconButton with shadcn/ui Button variant
- **Requirement 15.1**: Integrates lucide-react icons
- **Requirement 14.7**: Implements shadcn/ui Tooltip integration
