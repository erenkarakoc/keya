import { useEffect } from "react"
import { PropertyEditModalHeader } from "./PropertyEditModalHeader"
import { PropertyEditModalFormWrapper } from "./PropertyEditModalFormWrapper"

const PropertyEditModal = () => {
  useEffect(() => {
    document.body.classList.add("modal-open")
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [])

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_property"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-650px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <PropertyEditModalHeader />
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <PropertyEditModalFormWrapper />
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  )
}

export { PropertyEditModal }
