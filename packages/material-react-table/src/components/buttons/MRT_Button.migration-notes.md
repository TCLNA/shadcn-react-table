# MRT_Button Migration Notes

## Component Overview
`MRT_Button` is a wrapper component around shadcn/ui's Button component that provides backward compatibility with MUI Button patterns used throughout Material React Table.

## Migration Status
✅ **COMPLETED** - Task 7.1

## Key Features

### 1. MUI Variant Mapping
The component automatically maps MUI button variant names to shadcn/ui equivalents:
- `contained` → `default` (primary button with background)
- `outlined` → `outline` (button with border)
- `text` → `ghost` (button without background)

### 2. Icon Support
Added `startIcon` and `endIcon` props to match MUI Button API:
```typescript
<MRT_Button startIcon={<Search />}>
  Search
</MRT_Button>

<MRT_Button endIcon={<ChevronRight />}>
  Next
</MRT_Button>
```

### 3. Backward Compatibility
- Accepts all standard shadcn/ui Button props
- Supports both MUI and shadcn/ui variant names
- Maintains ref forwarding
- Preserves className merging with `cn()` utility

## Usage Examples

### Basic Button
```typescript
import { MRT_Button } from './components/buttons/MRT_Button';

<MRT_Button onClick={handleClick}>
  Click Me
</MRT_Button>
```

### With MUI Variant (Backward Compatible)
```typescript
<MRT_Button variant="contained" size="sm">
  Save
</MRT_Button>

<MRT_Button variant="outlined">
  Cancel
</MRT_Button>

<MRT_Button variant="text">
  Learn More
</MRT_Button>
```

### With Icons
```typescript
import { Save, X } from 'lucide-react';

<MRT_Button 
  variant="contained" 
  startIcon={<Save />}
  onClick={handleSave}
>
  Save Changes
</MRT_Button>

<MRT_Button 
  variant="ghost" 
  endIcon={<X />}
  onClick={handleClose}
>
  Close
</MRT_Button>
```

### With Custom Styling
```typescript
<MRT_Button 
  className="min-w-[100px]"
  variant="outline"
>
  Custom Width
</MRT_Button>
```

## Implementation Details

### Props Interface
```typescript
interface MRT_ButtonProps extends Omit<ButtonProps, 'variant'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 
    | 'default' 
    | 'destructive' 
    | 'outline' 
    | 'secondary' 
    | 'ghost' 
    | 'link'
    | 'contained'  // MUI compatibility
    | 'outlined'   // MUI compatibility
    | 'text';      // MUI compatibility
}
```

### Variant Mapping Logic
```typescript
const mappedVariant = React.useMemo(() => {
  switch (variant) {
    case 'contained':
      return 'default';
    case 'outlined':
      return 'outline';
    case 'text':
      return 'ghost';
    default:
      return variant as ButtonProps['variant'];
  }
}, [variant]);
```

### Icon Rendering
Icons are wrapped in `<span>` elements with `inline-flex items-center` classes to ensure proper alignment. The button automatically adds `gap-2` spacing when icons are present.

## Testing

### Test Coverage
- ✅ Basic rendering
- ✅ MUI variant mapping (contained, outlined, text)
- ✅ shadcn/ui native variants (destructive, secondary, link)
- ✅ startIcon and endIcon placement
- ✅ Icon spacing (gap-2 class)
- ✅ Custom className merging
- ✅ Disabled state
- ✅ Size variants (sm, lg, icon)
- ✅ Ref forwarding
- ✅ Event handlers (onClick)
- ✅ HTML button attributes pass-through

### Test File
`src/components/buttons/MRT_Button.test.tsx` - 30+ test cases

## Next Steps

### Immediate (Task 7.2)
- Create `MRT_IconButton` wrapper component
- Map to shadcn Button with `variant="ghost"` and `size="icon"`

### Future (Task 7.3)
- Migrate all existing button components to use MRT_Button
- Replace MUI Button imports with MRT_Button
- Update icon imports from @mui/icons-material to lucide-react

## Migration Pattern for Other Components

When migrating components that use MUI Button:

**Before:**
```typescript
import Button from '@mui/material/Button';

<Button
  onClick={handleClick}
  size="small"
  variant="text"
  {...buttonProps}
/>
```

**After:**
```typescript
import { MRT_Button } from '../buttons/MRT_Button';

<MRT_Button
  onClick={handleClick}
  size="sm"
  variant="ghost"  // or keep "text" for backward compatibility
  {...buttonProps}
/>
```

## Design Decisions

### Why Wrapper Component?
1. **Backward Compatibility**: Existing code using MUI variant names continues to work
2. **Icon Support**: MUI's startIcon/endIcon pattern is widely used in the codebase
3. **Gradual Migration**: Components can be migrated incrementally
4. **Type Safety**: TypeScript ensures correct prop usage

### Why Not Direct Replacement?
- Direct replacement would require updating all button usages simultaneously
- MUI and shadcn/ui have different prop patterns (size: "small" vs "sm")
- Icon placement differs between libraries
- Wrapper provides migration path without breaking changes

## Requirements Validated
- ✅ Requirement 1.7: Component uses shadcn/ui Button
- ✅ Requirement 14.1: MUI Button replaced with shadcn/ui Button
- ✅ Requirement 4.4: Maintains backward compatibility with MUI patterns
- ✅ Requirement 10.2: Full TypeScript support with proper types
- ✅ Requirement 10.7: JSDoc comments for public API

## Files Created
- `src/components/buttons/MRT_Button.tsx` - Component implementation
- `src/components/buttons/MRT_Button.test.tsx` - Unit tests
- `src/components/buttons/MRT_Button.migration-notes.md` - This file
