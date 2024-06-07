import { ListViewProvider, useListView } from "../_core/ListViewProvider"
import { QueryRequestProvider } from "../_core/QueryRequestProvider"
import { QueryResponseProvider } from "../_core/QueryResponseProvider"
import { OfficesListHeader } from "./components/header/OfficesListHeader"
import { OfficesTable } from "./table/OfficesTable"
import { OfficeEditModal } from "./office-edit-modal/OfficeEditModal"
import { KTCard } from "../../../../../_metronic/helpers"

const OfficesList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <OfficesListHeader />
        <OfficesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <OfficeEditModal />}
    </>
  )
}

const OfficesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <OfficesList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { OfficesListWrapper }
