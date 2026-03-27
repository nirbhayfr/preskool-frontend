import AddFeeInventoryModal from '@/components/fee-structure-and-inventory/AddFeeInventoryModal'
import { feeInventoryColumns } from '@/components/fee-structure-and-inventory/FeeInventoryColumns'
import { feeStructureColumns } from '@/components/fee-structure-and-inventory/FeeStructureColumns'

import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import { Button } from '@/components/ui/button'
import { useAllFeeInventory, useDeleteFeeInventory } from '@/hooks/useFeeInventory'
import { useAllFeeStructures, useDeleteFeeStructure } from '@/hooks/useFeeStructure'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function FeeStructureAndInventory() {
  const [openFeeInventory, setOpenFeeInventory] = useState(false)
  const [editingInventory, setEditingInventory] = useState(null)

  const navigate = useNavigate()

  const { mutate: deleteInventory } = useDeleteFeeInventory()
  const { mutate: deleteStructure } = useDeleteFeeStructure()

  const { data: feeStructures, isLoading, isError } = useAllFeeStructures()
  const {
    data: feeInventory,
    isLoading: isLoadingFee,
    isError: isErrorFee,
  } = useAllFeeInventory()

  if (isLoading || isLoadingFee) return <CircleLoader />
  if (isError || isErrorFee) return 'Error loading data'

  const onEdit = (data) => {
    setEditingInventory(data)
    setOpenFeeInventory(true)
  }

  const onDelete = (id) => {
    deleteInventory(id, {
      onSuccess: () => {
        toast.success('Inventory deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete inventory')
      },
    })
  }

  const onEditStructure = (data) => {
    navigate(`/fee-structure/edit/${data.class}`, {
      state: { academic_year: data.academic_year },
    })
  }

  const onDeleteStructure = (id) => {
    console.log(id)
    deleteStructure(id, {
      onSuccess: () => {
        toast.success('Inventory deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete inventory')
      },
    })
  }

  const downloadCSV = (rows, headers, fileName) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const exportFeeStructure = () => {
    if (!feeStructures?.length) return

    const headers = ['Class', 'Academic Year', 'Total Fees']

    const rows = feeStructures.map((row) => [
      row.class,
      row.academic_year,
      row.total_fees ?? 0,
    ])

    downloadCSV(rows, headers, 'fee-structure')
  }

  const exportFeeInventory = () => {
    if (!feeInventory?.length) return

    const headers = ['Fee Type', 'Amount', 'Category', 'Description']

    const rows = feeInventory.map((row) => [
      row.FeeType,
      row.Amount ?? 0,
      row.Category,
      row.Description,
    ])

    downloadCSV(rows, headers, 'fee-inventory')
  }

  return (
    <section className="p-6 space-y-8 capitalize">
      {/* Header with actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">Fee Structure & Inventory</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={() => navigate('add')}>
            Add Fee Structure
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setEditingInventory(null)
              setOpenFeeInventory(true)
            }}
          >
            Add Fee Inventory
          </Button>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="-space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Fee Structure</h2>
          <Button onClick={exportFeeStructure}>Export</Button>
        </div>
        <TableLayout
          columns={feeStructureColumns({
            onDelete: onDeleteStructure,
            onEdit: onEditStructure,
          })}
          data={feeStructures ?? []}
        />
      </div>

      {/* Fee Inventory */}
      <div className="-space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Fee Inventory</h2>
          <Button onClick={exportFeeInventory}>Export</Button>
        </div>
        <TableLayout
          columns={feeInventoryColumns({ onEdit, onDelete })}
          data={feeInventory ?? []}
        />
      </div>

      <AddFeeInventoryModal
        open={openFeeInventory}
        editingData={editingInventory}
        onClose={() => {
          setOpenFeeInventory(false)
          setEditingInventory(null)
        }}
      />
    </section>
  )
}

export default FeeStructureAndInventory
