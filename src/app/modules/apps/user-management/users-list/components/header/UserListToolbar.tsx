import { Link } from "react-router-dom"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { UsersListFilter } from "./UsersListFilter"

const UsersListToolbar = () => {
  return (
    <div
      className="d-flex justify-content-end"
      data-kt-user-table-toolbar="base"
    >
      <UsersListFilter />

      {/* begin::Export */}
      <button type="button" className="btn btn-light-primary me-3">
        <KTIcon iconName="exit-up" className="fs-2" />
        Dışa Aktar
      </button>
      {/* end::Export */}

      {/* begin::Add user */}
      <Link to="/arayuz/kullanici-yonetimi/kullanici-ekle" className="btn btn-primary">
        <KTIcon iconName="plus" className="fs-2" />
        Ekle
      </Link>
      {/* end::Add user */}
    </div>
  )
}

export { UsersListToolbar }
