import { type MRT_ColumnDef, MaterialReactTable } from '../../src';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Theming',
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
];

const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTheme = () => (
  <MaterialReactTable columns={columns} data={data} enableRowSelection />
);

export const CustomLightTheme = () => {
  return (
    <div
      style={{
        // Custom CSS variables for light theme
        ['--primary' as string]: '25 95% 53%', // Orange
        ['--secondary' as string]: '187 71% 42%', // Cyan
        ['--background' as string]: '60 100% 97%', // Light yellow
      }}
    >
      <MaterialReactTable columns={columns} data={data} enableRowSelection />
    </div>
  );
};

export const CustomDarkTheme = () => {
  return (
    <div
      className="dark"
      style={{
        // Custom CSS variables for dark theme
        ['--primary' as string]: '75 60% 45%', // Green
        ['--secondary' as string]: '187 71% 42%', // Cyan
      }}
    >
      <MaterialReactTable columns={columns} data={data} enableRowSelection />
    </div>
  );
};
