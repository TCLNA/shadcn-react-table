#!/bin/bash

# Script to help migrate MUI imports to shadcn/ui in story files
# This script performs basic find-and-replace operations

# Color codes for output
GREEN='\033[0.32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Storybook story migration...${NC}"

# Find all story files with MUI imports
STORY_FILES=$(find stories -name "*.tsx" -exec grep -l "@mui" {} \;)

for file in $STORY_FILES; do
  echo -e "${YELLOW}Processing: $file${NC}"
  
  # Backup original file
  cp "$file" "$file.bak"
  
  # Replace common MUI icon imports with lucide-react
  sed -i "s/import AccountCircleIcon from '@mui\/icons-material\/AccountCircle';/import { User } from 'lucide-react';/g" "$file"
  sed -i "s/import DeleteIcon from '@mui\/icons-material\/Delete';/import { Trash2 } from 'lucide-react';/g" "$file"
  sed -i "s/import Edit from '@mui\/icons-material\/Edit';/import { Pencil } from 'lucide-react';/g" "$file"
  sed -i "s/import ShareIcon from '@mui\/icons-material\/Share';/import { Share } from 'lucide-react';/g" "$file"
  sed -i "s/import AddBoxIcon from '@mui\/icons-material\/AddBox';/import { Plus } from 'lucide-react';/g" "$file"
  sed -i "s/import Add from '@mui\/icons-material\/Add';/import { Plus } from 'lucide-react';/g" "$file"
  
  # Replace MUI component imports
  sed -i "s/import Button from '@mui\/material\/Button';/import { Button } from '..\/..\/src\/components\/ui\/button';/g" "$file"
  sed -i "s/import IconButton from '@mui\/material\/IconButton';/\/\/ IconButton replaced with Button variant=\"ghost\" size=\"icon\"/g" "$file"
  sed -i "s/import MenuItem from '@mui\/material\/MenuItem';/import { DropdownMenuItem } from '..\/..\/src\/components\/ui\/dropdown-menu';/g" "$file"
  sed -i "s/import Box from '@mui\/material\/Box';/\/\/ Box replaced with div + Tailwind classes/g" "$file"
  sed -i "s/import Typography from '@mui\/material\/Typography';/\/\/ Typography replaced with native HTML + Tailwind/g" "$file"
  sed -i "s/import Tooltip from '@mui\/material\/Tooltip';/import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '..\/..\/src\/components\/ui\/tooltip';/g" "$file"
  
  # Remove MUI theme imports
  sed -i "/import.*from '@mui\/material\/styles';/d" "$file"
  sed -i "/import.*ThemeProvider.*from '@mui\/material\/styles';/d" "$file"
  sed -i "/import.*createTheme.*from '@mui\/material\/styles';/d" "$file"
  
  # Replace icon usage in JSX (basic patterns)
  sed -i "s/<AccountCircleIcon \/>/<User className=\"mr-2 h-4 w-4\" \/>/g" "$file"
  sed -i "s/<DeleteIcon \/>/<Trash2 className=\"mr-2 h-4 w-4\" \/>/g" "$file"
  sed -i "s/<Edit \/>/<Pencil className=\"h-4 w-4\" \/>/g" "$file"
  sed -i "s/<ShareIcon \/>/<Share className=\"mr-2 h-4 w-4\" \/>/g" "$file"
  sed -i "s/<AddBoxIcon \/>/<Plus className=\"h-4 w-4\" \/>/g" "$file"
  sed -i "s/<Add \/>/<Plus className=\"h-4 w-4\" \/>/g" "$file"
  
  # Replace MenuItem with DropdownMenuItem
  sed -i "s/<MenuItem/<DropdownMenuItem/g" "$file"
  sed -i "s/<\/MenuItem>/<\/DropdownMenuItem>/g" "$file"
  
  echo -e "${GREEN}✓ Completed: $file${NC}"
  echo -e "  Backup saved as: $file.bak"
done

echo -e "${GREEN}Migration script completed!${NC}"
echo -e "${YELLOW}Note: This script performs basic replacements.${NC}"
echo -e "${YELLOW}Manual review and adjustments are required for:${NC}"
echo -e "  - IconButton → Button with variant/size props"
echo -e "  - Tooltip wrapping patterns"
echo -e "  - Box → div with Tailwind classes"
echo -e "  - Typography → native HTML with Tailwind"
echo -e "  - Button color/variant mappings"
echo -e "  - Complex component patterns"
