import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper()

export const feeInventoryColumns = () => [
  columnHelper.accessor('fee_id', {
    header: 'Fee ID',
    cell: (info) => <span className="font-medium text-primary">{info.getValue()}</span>,
  }),

  columnHelper.accessor('class', {
    header: 'Class',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('fee_type', {
    header: 'Fee Type',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('academic_year', {
    header: 'Academic Year',
    cell: (info) => info.getValue(),
  }),
]
