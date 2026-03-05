import AddFeeInventoryModal from '@/components/fee-structure-and-inventory/AddFeeInventoryModal'
import AddTransportModal from '@/components/fee-structure-and-inventory/AddTransportModal'
import { feeInventoryColumns } from '@/components/fee-structure-and-inventory/FeeInventoryColumns'
import { feeStructureColumns } from '@/components/fee-structure-and-inventory/FeeStructureColumns'
import { transportColumns } from '@/components/fee-structure-and-inventory/TransportColumns'
import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import { Button } from '@/components/ui/button'
import { useAllFeeInventory, useDeleteFeeInventory } from '@/hooks/useFeeInventory'
import { useAllFeeStructures, useDeleteFeeStructure } from '@/hooks/useFeeStructure'
import { useDeleteTransport, useTransport } from '@/hooks/useTransport'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function FeeStructureAndInventory() {
  const [openFeeInventory, setOpenFeeInventory] = useState(false)
  const [editingInventory, setEditingInventory] = useState(null)

  const [openTransport, setOpenTransport] = useState(false)
  const [editingTransport, setEditingTransport] = useState(null)

  const navigate = useNavigate()

  const { mutate: deleteInventory } = useDeleteFeeInventory()
  const { mutate: deleteStructure } = useDeleteFeeStructure()
  const { mutate: deleteTransport } = useDeleteTransport()

  const { data: feeStructures, isLoading, isError } = useAllFeeStructures()
  const {
    data: feeInventory,
    isLoading: isLoadingFee,
    isError: isErrorFee,
  } = useAllFeeInventory()

  const {
    data: transport,
    isLoading: isLoadingTransport,
    isError: isErrorTransport,
  } = useTransport()

  if (isLoading || isLoadingFee || isLoadingTransport) return <CircleLoader />
  if (isError || isErrorFee || isErrorTransport) return 'Error loading data'

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

  const onDeleteTransport = (id) => {
    deleteTransport(id, {
      onSuccess: () => {
        toast.success('Transport deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete transport')
      },
    })
  }

  const onEditTransport = (data) => {
    setEditingTransport(data)
    setOpenTransport(true)
  }

  return (
    <section className="p-6 space-y-8 capitalize">
      {/* Header with actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Fee Structure, Inventory & Transport
        </h1>

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

          <Button
            variant="outline"
            onClick={() => {
              setEditingTransport(null)
              setOpenTransport(true)
            }}
          >
            Add Transport
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

      {/* Transport */}
      <div className="-space-y-10">
        <h2 className="text-xl font-semibold">Transport</h2>

        <TableLayout
          columns={transportColumns({
            onEdit: onEditTransport,
            onDelete: onDeleteTransport,
          })}
          data={transport ?? []}
        />
      </div>

      <AddTransportModal
        open={openTransport}
        editingData={editingTransport}
        onClose={() => {
          setOpenTransport(false)
          setEditingTransport(null)
        }}
      />
    </section>
  )
}

export default FeeStructureAndInventory
