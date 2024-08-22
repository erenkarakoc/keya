import { KTIcon } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../../_core/ListViewProvider"

const PropertiesListSearchComponent = () => {
  const { searchTerm, setSearchTerm } = useListView()

  return (
    <div className="card-title">
      {/* begin::Search */}
      <div className="d-flex align-items-center position-relative my-1">
        <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
        <input
          type="text"
          data-kt-property-table-filter="search"
          className="form-control form-control-solid w-250px ps-14"
          placeholder="İlan Ara"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export { PropertiesListSearchComponent }
