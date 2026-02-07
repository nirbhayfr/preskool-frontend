// feeStructureColumns.ts
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper()

const months = [
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
  'jan',
  'feb',
  'mar',
]

export const feeStructureColumns = () => [
  columnHelper.accessor('structure_id', {
    header: 'Structure ID',
    cell: (info) => <span className="text-primary font-medium">{info.getValue()}</span>,
  }),

  columnHelper.accessor('class', {
    header: 'Class',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('academic_year', {
    header: 'Academic Year',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('admission_fee', {
    header: 'Admission Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('annual_fee', {
    header: 'Annual Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('exam_fee', {
    header: 'Exam Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('library_fee', {
    header: 'Library Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('computer_fee', {
    header: 'Computer Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('sports_fee', {
    header: 'Sports Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('lab_fee', {
    header: 'Lab Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('misc_fee', {
    header: 'Misc Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  ...months.map((month) =>
    columnHelper.accessor(`${month}_tuition_fee`, {
      header: `${month.toUpperCase()} Tuition`,
      cell: (info) => `₹${info.getValue()}`,
    })
  ),
]
