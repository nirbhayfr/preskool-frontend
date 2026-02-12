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
  if (isError || isErrorFee) return 'Error loading staff'

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
        <h2 className="text-xl font-semibold">Fee Structure</h2>
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
        <h2 className="text-xl font-semibold">Fee Inventory</h2>
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
