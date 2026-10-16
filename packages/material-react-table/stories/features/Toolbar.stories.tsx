import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../src/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../src/components/ui/tooltip';
import {
  type MRT_ColumnDef,
  MRT_ToggleFullScreenButton,
  MaterialReactTable,
} from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
};

export default meta;

const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
}));

export const ToolbarEnabledDefault = () => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
  />
);

export const NoToolbars = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const HideToolbarInternalActions = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const CustomToolbarInternalActions = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    renderToolbarInternalActions={({ table }) => {
      return (
        <>
          <MRT_ToggleFullScreenButton table={table} />
        </>
      );
    }}
  />
);

export const TableTitle = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <h2 className="text-2xl font-bold">Table Title</h2>;
    }}
  />
);

export const CustomTopToolbarActions = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCreateNewUser}>
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New User</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }}
  />
);

export const CustomBottomToolbarActions = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCreateNewUser}>
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New User</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }}
  />
);

export const CustomTopToolbarSelectionActions = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            variant="secondary"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarSelectionActions = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            variant="secondary"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottom = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderTopToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCreateNewUser}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New User</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  onClick={handleRemoveUsers}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove Users</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    }}
  />
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderBottomToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCreateNewUser}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New User</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  onClick={handleRemoveUsers}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove Users</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    }}
  />
);

export const renderCustomTopToolbar = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    renderTopToolbar={() => <div className="p-8">Custom Top Toolbar</div>}
  />
);

export const renderCustomBottomToolbar = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => (
      <div className="p-8">Custom Bottom Toolbar</div>
    )}
  />
);
