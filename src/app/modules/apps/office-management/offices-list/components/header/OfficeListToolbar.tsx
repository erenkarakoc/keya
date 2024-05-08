import { KTIcon } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../core/ListViewProvider"
import { OfficesListFilter } from "./OfficesListFilter"

const OfficesListToolbar = () => {
  const { setItemIdForUpdate } = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div
      className="d-flex justify-content-end"
      data-kt-user-table-toolbar="base"
    >
      <OfficesListFilter />

      {/* begin::Export */}
      <button type="button" className="btn btn-light-primary me-3">
        <KTIcon iconName="exit-up" className="fs-2" />
        Dışa Aktar
      </button>
      {/* end::Export */}

      {/* begin::Add user */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={openAddUserModal}
      >
        <KTIcon iconName="plus" className="fs-2" />
        Ekle
      </button>
      {/* end::Add user */}
    </div>
  )
}

export { OfficesListToolbar }
