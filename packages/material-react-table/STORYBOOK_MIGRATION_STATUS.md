# Storybook Migration Status

## Overview
This document tracks the migration of Storybook stories from MUI to shadcn/ui components.

## Migration Progress

### Completed Files (3/21)
- ✅ `stories/features/RowActions.stories.tsx` - Migrated to lucide-react icons and shadcn/ui components
- ✅ `stories/features/Toolbar.stories.tsx` - Migrated to lucide-react icons and shadcn/ui components  
- ✅ `stories/styling/Theming.stories.tsx` - Migrated to CSS variables for theming

### Remaining Files (18/21)
- ⏳ `stories/fixed-bugs/click-propogation.stories.tsx`
- ⏳ `stories/fixed-bugs/useEffects.stories.tsx`
- ⏳ `stories/fixed-bugs/fullscreen-with-appbar.stories.tsx`
- ⏳ `stories/styling/CustomTableBody.stories.tsx`
- ⏳ `stories/styling/TableHeadCellStyles.stories.tsx`
- ⏳ `stories/styling/StylingDisplayColumns.stories.tsx`
- ⏳ `stories/features/SubRowTree.stories.tsx`
- ⏳ `stories/features/CellActions.stories.tsx`
- ⏳ `stories/features/Aggregation.stories.tsx`
- ⏳ `stories/features/RowNumbers.stories.tsx`
- ⏳ `stories/features/RowPinning.stories.tsx`
- ⏳ `stories/features/Memod.stories.tsx`
- ⏳ `stories/features/ColumnActions.stories.tsx`
- ⏳ `stories/features/Editing.stories.tsx`
- ⏳ `stories/features/Selection.stories.tsx`
- ⏳ `stories/features/Filtering.stories.tsx`
- ⏳ `stories/features/Virtualization.stories.tsx`
- ⏳ `stories/features/Creating.stories.tsx`

## Migration Patterns

### MUI → shadcn/ui Component Mapping

| MUI Component | shadcn/ui Replacement | Notes |
|--------------|----------------------|-------|
| `Button` | `Button` from `../../src/components/ui/button` | Map variants: `contained` → `default`, `outlined` → `outline`, `text` → `ghost` |
| `IconButton` | `Button` with `variant="ghost" size="icon"` | Wrap icon in Button |
| `MenuItem` | `DropdownMenuItem` from `../../src/components/ui/dropdown-menu` | Used in row action menus |
| `Tooltip` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | Requires provider wrapper |
| `Typography` | Native HTML elements with Tailwind classes | `variant="h4"` → `<h2 className="text-2xl font-bold">` |
| `Box` | `<div>` with Tailwind classes | `sx={{ p: '2rem' }}` → `className="p-8"` |
| `Select` | `Select` from `../../src/components/ui/select` | Different API structure |

### MUI Icons → lucide-react Mapping

| MUI Icon | lucide-react Icon |
|----------|------------------|
| `AccountCircleIcon` | `User` |
| `DeleteIcon` | `Trash2` |
| `Edit` | `Pencil` |
| `ShareIcon` | `Share` |
| `AddBoxIcon` / `Add` | `Plus` |
| `MoreVert` | `MoreVertical` |

### Common Patterns

#### Pattern 1: Button with Icon
```tsx
// Before (MUI)
<Button color="primary" variant="contained">
  <AddIcon /> Add
</Button>

// After (shadcn/ui)
<Button>
  <Plus className="mr-2 h-4 w-4" /> Add
</Button>
```

#### Pattern 2: IconButton with Tooltip
```tsx
// Before (MUI)
<Tooltip title="Delete">
  <IconButton onClick={handleDelete}>
    <DeleteIcon />
  </IconButton>
</Tooltip>

// After (shadcn/ui)
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Delete</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Pattern 3: MenuItem in Row Actions
```tsx
// Before (MUI)
<MenuItem onClick={handleClick}>
  <DeleteIcon /> Remove
</MenuItem>

// After (shadcn/ui)
<DropdownMenuItem onClick={handleClick}>
  <Trash2 className="mr-2 h-4 w-4" /> Remove
</DropdownMenuItem>
```

#### Pattern 4: Flex Layout
```tsx
// Before (MUI)
<div style={{ display: 'flex', gap: '0.5rem' }}>
  {/* content */}
</div>

// After (Tailwind)
<div className="flex gap-2">
  {/* content */}
</div>
```

#### Pattern 5: Button Variants
```tsx
// Before (MUI)
<Button color="error" variant="contained">Delete</Button>
<Button color="success" variant="contained">Save</Button>
<Button color="info" variant="outlined">Info</Button>

// After (shadcn/ui)
<Button variant="destructive">Delete</Button>
<Button>Save</Button>
<Button variant="secondary">Info</Button>
```

## Next Steps

1. Apply migration patterns to remaining 18 story files
2. Test each migrated story in Storybook to ensure visual correctness
3. Update any custom styling to use Tailwind classes
4. Verify all stories render without errors

## Testing Checklist

After migration:
- [ ] Run `pnpm storybook` to start Storybook
- [ ] Verify all stories load without errors
- [ ] Check visual appearance matches expected design
- [ ] Test interactive features (buttons, menus, tooltips)
- [ ] Verify dark mode works correctly
- [ ] Check responsive behavior
