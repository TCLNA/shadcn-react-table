import { type Meta } from '@storybook/react';
import { MaterialReactTable, type MRT_ColumnDef } from '../../src';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Date Filtering',
};

export default meta;

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  hireDate: Date;
};

const data: Person[] = [...Array(100)].map(() => ({
  id: faker.number.int(1000),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  hireDate: faker.date.past({ years: 10 }),
}));

export const DateFilterExample = () => {
  const columns: MRT_ColumnDef<Person>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'birthDate',
      header: 'Birth Date',
      filterVariant: 'date',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    },
    {
      accessorKey: 'hireDate',
      header: 'Hire Date',
      filterVariant: 'date',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    },
  ];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnFilters
      initialState={{
        showColumnFilters: true,
      }}
    />
  );
};

export const DateRangeFilterExample = () => {
  const columns: MRT_ColumnDef<Person>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'birthDate',
      header: 'Birth Date',
      filterVariant: 'date-range',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    },
    {
      accessorKey: 'hireDate',
      header: 'Hire Date',
      filterVariant: 'date-range',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    },
  ];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnFilters
      initialState={{
        showColumnFilters: true,
      }}
    />
  );
};

export const MixedDateFiltersExample = () => {
  const columns: MRT_ColumnDef<Person>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'birthDate',
      header: 'Birth Date (Single Date)',
      filterVariant: 'date',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    },
    {
      accessorKey: 'hireDate',
      header: 'Hire Date (Date Range)',
      filterVariant: 'date-range',
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
    },
  ];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnFilters
      initialState={{
        showColumnFilters: true,
      }}
    />
  );
};
