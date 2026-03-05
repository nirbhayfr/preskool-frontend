export default function SearchHeader({ column, title }) {
  return (
    <div className="flex flex-col gap-1">
      <span>{title}</span>
      <input
        className="border rounded px-2 py-1 text-xs w-20"
        placeholder="Search..."
        value={column.getFilterValue() ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
      />
    </div>
  )
}
