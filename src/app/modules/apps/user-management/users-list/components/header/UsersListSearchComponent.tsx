import { KTIcon } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../../_core/ListViewProvider"

const UsersListSearchComponent = () => {
  const { searchTerm, setSearchTerm } = useListView()

  return (
    <div className="card-title">
      {/* begin::Search */}
      <div className="d-flex align-items-center position-relative my-1 position-relative">
        <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
        <input
          type="text"
          id="users_list_search_user_input"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-250px ps-14"
          placeholder="Kullanıcı Ara"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export { UsersListSearchComponent }
