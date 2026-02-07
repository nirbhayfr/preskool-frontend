import { feeInventoryColumns } from '@/components/fee-structure-and-inventory/FeeInventoryColumns'
import { feeStructureColumns } from '@/components/fee-structure-and-inventory/FeeStructureColumns'
import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import { Button } from '@/components/ui/button'
import { useAllFeeInventory } from '@/hooks/useFeeInventory'
import { useAllFeeStructures } from '@/hooks/useFeeStructure'

function FeeStructureAndInventory() {
  const { data: feeStructures, isLoading, isError } = useAllFeeStructures()
  const {
    data: feeInventory,
    isLoading: isLoadingFee,
    isError: isErrorFee,
  } = useAllFeeInventory()
  if (isLoading || isLoadingFee) return <CircleLoader />
  if (isError || isErrorFee) return 'Error loading staff'

  console.log(feeInventory)

  return (
    <section className="p-6 space-y-8 capitalize">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fee Structure & Inventory</h1>

        <div className="flex gap-2">
          <Button>Add Fee Structure</Button>

          <Button variant="outline">Add Fee Inventory</Button>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="-space-y-10">
        <h2 className="text-xl font-semibold">Fee Structure</h2>
        <TableLayout columns={feeStructureColumns()} data={feeStructures ?? []} />
      </div>

      {/* Fee Inventory */}
      <div className="-space-y-10">
        <h2 className="text-xl font-semibold">Fee Inventory</h2>
        <TableLayout columns={feeInventoryColumns()} data={feeInventory ?? []} />
      </div>
    </section>
  )
}

export default FeeStructureAndInventory
