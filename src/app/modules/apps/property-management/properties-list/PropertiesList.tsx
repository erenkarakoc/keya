import { ListViewProvider, useListView } from "../_core/ListViewProvider"
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
  <ListViewProvider>
    <PropertiesList />
  </ListViewProvider>
)

export { PropertiesListWrapper }
