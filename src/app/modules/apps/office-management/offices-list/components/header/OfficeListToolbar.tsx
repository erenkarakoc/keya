import { Link } from "react-router-dom"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { OfficesListFilter } from "./OfficesListFilter"

const OfficesListToolbar = () => {
  return (
    <div
      className="d-flex justify-content-end"
      data-kt-office-table-toolbar="base"
    >
      <OfficesListFilter />

      {/* begin::Export */}
      <button type="button" className="btn btn-light-primary me-3">
        <KTIcon iconName="exit-up" className="fs-2" />
        Dışa Aktar
      </button>
      {/* end::Export */}

      {/* begin::Add office */}
      <Link to="/arayuz/ofis-yonetimi/ofis-ekle" className="btn btn-primary">
        <KTIcon iconName="plus" className="fs-2" />
        Ekle
      </Link>
      {/* end::Add office */}
    </div>
  )
}

export { OfficesListToolbar }
