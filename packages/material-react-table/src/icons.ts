/**
 * Icon mapping from Material UI icons to lucide-react icons
 * 
 * This file provides a consistent icon interface for Material React Table
 * while using lucide-react as the icon library instead of @mui/icons-material.
 * 
 * All icons maintain the same naming convention as the original MUI icons
 * to preserve backward compatibility with the existing codebase.
 */

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Eye,
  EyeOff,
  Filter,
  FilterX,
  GripVertical,
  Layers,
  Loader2,
  Maximize,
  Minimize,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Pin,
  Plus,
  RotateCcw,
  Save,
  Search,
  SearchX,
  SortAsc,
  Trash2,
  X,
  Columns3,
  ArrowUpDown,
  AlignJustify,
  AlignLeft,
  AlignCenter,
} from 'lucide-react';

/**
 * Default icon set for Material React Table
 * Maps MUI icon names to lucide-react equivalents
 */
export const MRT_Default_Icons = {
  // Arrow icons
  ArrowDownwardIcon: ArrowDown,
  ArrowUpwardIcon: ArrowUp,
  ArrowRightIcon: ArrowRight,
  
  // Chevron icons
  ChevronLeftIcon: ChevronLeft,
  ChevronRightIcon: ChevronRight,
  ExpandMoreIcon: ChevronDown,
  
  // Action icons
  CancelIcon: X,
  CloseIcon: X,
  SaveIcon: Save,
  EditIcon: Pencil,
  DeleteIcon: Trash2,
  AddIcon: Plus,
  RemoveIcon: Minus,
  
  // Filter and search icons
  FilterListIcon: Filter,
  FilterAltIcon: Filter,
  FilterListOffIcon: FilterX,
  SearchIcon: Search,
  SearchOffIcon: SearchX,
  
  // Sorting icons
  SortIcon: SortAsc,
  SyncAltIcon: ArrowUpDown,
  
  // View and visibility icons
  VisibilityIcon: Eye,
  VisibilityOffIcon: EyeOff,
  ViewColumnIcon: Columns3,
  
  // Layout and density icons
  DensityLargeIcon: AlignJustify,
  DensityMediumIcon: AlignCenter,
  DensitySmallIcon: AlignLeft,
  
  // Drag and drop icons
  DragHandleIcon: GripVertical,
  DragIndicatorIcon: GripVertical,
  
  // Pagination icons
  FirstPageIcon: ChevronsLeft,
  LastPageIcon: ChevronsRight,
  KeyboardDoubleArrowDownIcon: ChevronsDown,
  
  // Fullscreen icons
  FullscreenIcon: Maximize,
  FullscreenExitIcon: Minimize,
  
  // Menu icons
  MoreVertIcon: MoreVertical,
  MoreHorizIcon: MoreHorizontal,
  
  // Utility icons
  ContentCopy: Copy,
  PushPinIcon: Pin,
  RestartAltIcon: RotateCcw,
  ClearAllIcon: FilterX,
  DynamicFeedIcon: Layers,
  
  // Loading icons
  CircularProgressIcon: Loader2,
} as const;

/**
 * Type definition for the icon set
 * Allows users to override icons while maintaining type safety
 */
export type MRT_Icons = Record<keyof typeof MRT_Default_Icons, any>;

/**
 * Utility function for dynamic icon selection
 * 
 * @param iconName - The name of the icon to retrieve
 * @param customIcons - Optional custom icon overrides
 * @returns The icon component
 * 
 * @example
 * ```tsx
 * const Icon = getIcon('SearchIcon', customIcons);
 * return <Icon className="w-4 h-4" />;
 * ```
 */
export function getIcon(
  iconName: keyof typeof MRT_Default_Icons,
  customIcons?: Partial<MRT_Icons>
): any {
  return customIcons?.[iconName] ?? MRT_Default_Icons[iconName];
}

/**
 * Utility function to merge custom icons with default icons
 * 
 * @param customIcons - Custom icon overrides
 * @returns Merged icon set
 * 
 * @example
 * ```tsx
 * const icons = mergeIcons({
 *   SearchIcon: MyCustomSearchIcon,
 *   FilterListIcon: MyCustomFilterIcon,
 * });
 * ```
 */
export function mergeIcons(customIcons?: Partial<MRT_Icons>): MRT_Icons {
  return {
    ...MRT_Default_Icons,
    ...customIcons,
  } as MRT_Icons;
}

/**
 * Icon mapping reference for migration
 * 
 * This documents the mapping from MUI icons to lucide-react icons:
 * 
 * | MUI Icon              | lucide-react Icon  | Usage                          |
 * |-----------------------|--------------------|--------------------------------|
 * | ArrowDownward         | ArrowDown          | Sorting, navigation            |
 * | ArrowUpward           | ArrowUp            | Sorting, navigation            |
 * | FilterList            | Filter             | Column filtering               |
 * | Search                | Search             | Global search                  |
 * | Close                 | X                  | Close dialogs, clear filters   |
 * | MoreVert              | MoreVertical       | Row/column action menus        |
 * | Edit                  | Pencil             | Edit actions                   |
 * | Delete                | Trash2             | Delete actions                 |
 * | Save                  | Save               | Save actions                   |
 * | Cancel                | X                  | Cancel actions                 |
 * | Add                   | Plus               | Add row/column                 |
 * | Remove                | Minus              | Remove row/column              |
 * | ExpandMore            | ChevronDown        | Expand rows/sections           |
 * | ChevronRight          | ChevronRight       | Collapse rows/sections         |
 * | DragIndicator         | GripVertical       | Drag handle for rows/columns   |
 * | Visibility            | Eye                | Show/hide columns              |
 * | VisibilityOff         | EyeOff             | Show/hide columns              |
 * | ContentCopy           | Copy               | Copy to clipboard              |
 * | Fullscreen            | Maximize           | Enter fullscreen               |
 * | FullscreenExit        | Minimize           | Exit fullscreen                |
 * | FirstPage             | ChevronsLeft       | Pagination first page          |
 * | LastPage              | ChevronsRight      | Pagination last page           |
 * | ViewColumn            | Columns3           | Column visibility menu         |
 * | RestartAlt            | RotateCcw          | Reset filters/state            |
 * | PushPin               | Pin                | Pin columns                    |
 * | DensityLarge          | AlignJustify       | Large density mode             |
 * | DensityMedium         | AlignCenter        | Medium density mode            |
 * | DensitySmall          | AlignLeft          | Small density mode             |
 * | SyncAlt               | ArrowUpDown        | Sort direction toggle          |
 * | DynamicFeed           | Layers             | Multiple selection/grouping    |
 */
