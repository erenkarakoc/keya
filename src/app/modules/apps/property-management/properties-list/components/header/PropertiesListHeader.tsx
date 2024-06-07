import { useListView } from "../../../_core/ListViewProvider"
import { PropertiesListToolbar } from "./PropertiesListToolbar"
import { PropertiesListGrouping } from "./PropertiesListGrouping"
import { PropertiesListSearchComponent } from "./PropertiesListSearchComponent"

const PropertiesListHeader = () => {
  const { selected } = useListView()
  return (
    <div className="card-header border-0 pt-6">
      <PropertiesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? <PropertiesListGrouping /> : <PropertiesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export { PropertiesListHeader }
