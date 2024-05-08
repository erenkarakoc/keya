import { useListView } from "../../core/ListViewProvider"
import { OfficesListToolbar } from "./OfficeListToolbar"
import { OfficesListGrouping } from "./OfficesListGrouping"
import { OfficesListSearchComponent } from "./OfficesListSearchComponent"

const OfficesListHeader = () => {
  const { selected } = useListView()
  return (
    <div className="card-header border-0 pt-6">
      <OfficesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? <OfficesListGrouping /> : <OfficesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export { OfficesListHeader }
