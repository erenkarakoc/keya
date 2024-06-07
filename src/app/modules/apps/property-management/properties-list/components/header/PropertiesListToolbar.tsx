import { Link } from "react-router-dom"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { PropertiesListFilter } from "./PropertiesListFilter"

const PropertiesListToolbar = () => {
  return (
    <div
      className="d-flex justify-content-end"
      data-kt-property-table-toolbar="base"
    >
      <PropertiesListFilter />

      {/* begin::Export */}
      <button type="button" className="btn btn-light-primary me-3">
        <KTIcon iconName="exit-up" className="fs-2" />
        Dışa Aktar
      </button>
      {/* end::Export */}

      {/* begin::Add property */}
      <Link to="/arayuz/ilan-yonetimi/ilan-ekle" className="btn btn-primary">
        <KTIcon iconName="plus" className="fs-2" />
        Ekle
      </Link>
      {/* end::Add property */}
    </div>
  )
}

export { PropertiesListToolbar }
