import { useState } from 'react';
import { User, Trash2, Pencil, Share } from 'lucide-react';
import { Button } from '../../src/components/ui/button';
import { DropdownMenuItem } from '../../src/components/ui/dropdown-menu';
import { type MRT_ColumnDef, MaterialReactTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Row Actions Examples',
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
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(10)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const RowActionsEnabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <User className="mr-2 h-4 w-4" /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share className="mr-2 h-4 w-4" /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const RowActionsEnabledConditionally = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowActions={enabled}
      renderRowActionMenuItems={({ closeMenu, row }) => [
        <DropdownMenuItem
          key={1}
          onClick={() => {
            console.info('View Profile', row);
            closeMenu();
          }}
        >
          <User className="mr-2 h-4 w-4" /> View Profile
        </DropdownMenuItem>,
        <DropdownMenuItem
          key={2}
          onClick={() => {
            console.info('Remove', row);
            closeMenu();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Remove
        </DropdownMenuItem>,
        <DropdownMenuItem
          key={3}
          onClick={() => {
            console.info('Share', row);
            closeMenu();
          }}
        >
          <Share className="mr-2 h-4 w-4" /> Share
        </DropdownMenuItem>,
      ]}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnabled(!enabled)}>Toggle Row Actions</Button>
      )}
    />
  );
};

export const RowActionsEnabledConditionallyPerRow = () => {
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={({ closeMenu, row }) =>
        row.index % 2 === 0
          ? undefined
          : [
              <DropdownMenuItem
                key={1}
                onClick={() => {
                  console.info('View Profile', row);
                  closeMenu();
                }}
              >
                <User className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>,
              <DropdownMenuItem
                key={2}
                onClick={() => {
                  console.info('Remove', row);
                  closeMenu();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </DropdownMenuItem>,
              <DropdownMenuItem
                key={3}
                onClick={() => {
                  console.info('Share', row);
                  closeMenu();
                }}
              >
                <Share className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>,
            ]
      }
    />
  );
};

export const RowActionsAndEditingEnabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <User className="mr-2 h-4 w-4" /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share className="mr-2 h-4 w-4" /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const RowActionsAndEditingCellEnabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <User className="mr-2 h-4 w-4" /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share className="mr-2 h-4 w-4" /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const RowActionsLastColumn = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowActions
    initialState={{ density: 'compact' }}
    positionActionsColumn="last"
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <User className="mr-2 h-4 w-4" /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share className="mr-2 h-4 w-4" /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const CustomRowActionButtons = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActions={({ row }) => (
      <div className="flex flex-nowrap gap-2">
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </Button>
      </div>
    )}
  />
);

export const CustomRowActionButtonsLastColumn = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enableRowActions
    positionActionsColumn="last"
    renderRowActions={({ row }) => (
      <div className="flex flex-nowrap gap-2">
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </Button>
      </div>
    )}
  />
);

export const RowActionsCompleteOverride = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'mrt-row-actions': {
        Cell: ({ row, table }) => (
          <div className="flex items-center gap-2">
            <Button>Custom Row Action</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.setEditingRow(row)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 300,
      },
    }}
    editDisplayMode="row"
    enableEditing
    enableRowActions
  />
);
