import { ListViewProvider, useListView } from "../_core/ListViewProvider"
import { QueryRequestProvider } from "../_core/QueryRequestProvider"
import { QueryResponseProvider } from "../_core/QueryResponseProvider"
import { PropertiesListHeader } from "./components/header/PropertiesListHeader"
import { PropertiesTable } from "./table/PropertiesTable"
import { PropertyEditModal } from "./property-edit-modal/PropertyEditModal"
import { KTCard } from "../../../../../_metronic/helpers"

const PropertiesList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <PropertiesListHeader />
        <PropertiesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <PropertyEditModal />}
    </>
  )
}

const PropertiesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <PropertiesList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { PropertiesListWrapper }
