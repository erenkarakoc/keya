import "./OfficeDeleteModal.css"

import clsx from "clsx"
import React, { useEffect, useState } from "react"

import { Office } from "../core/_models"

interface OfficeDeleteModalProps {
  id: string
  title?: string
  description?: string
  onApproval?: () => void
  onDecline?: () => void
  selectedOfficesForDelete?: Office[]
}

const OfficeDeleteModal: React.FC<OfficeDeleteModalProps> = ({
  id,
  title,
  description,
  onApproval,
  onDecline,
  selectedOfficesForDelete,
}) => {
  const [officesArray, setOfficesArray] = useState<Office[]>([])

  useEffect(() => {
    selectedOfficesForDelete && setOfficesArray(selectedOfficesForDelete)
  }, [selectedOfficesForDelete])

  return (
    <div className="modal fade" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder m-0">{title}</h2>
          </div>

          <div className="modal-body">
            <p>{description}</p>

            {selectedOfficesForDelete && (
              <div className="confirmation-modal-offices">
                {officesArray.map((office) => (
                  <div
                    className="d-flex align-items-center confirmation-modal-office"
                    key={office.id}
                  >
                    <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                      <a href="#">
                        {office.photoURLs ? (
                          <div className="symbol-label">
                            <img
                              src={`${office.photoURLs}`}
                              alt={office.name}
                              className="w-100"
                            />
                          </div>
                        ) : (
                          <div className={clsx("symbol-label fs-3")}>
                            {office.name.charAt(0)}
                          </div>
                        )}
                      </a>
                    </div>
                    <div className="d-flex flex-column">
                      <a
                        href="#"
                        className="text-gray-800 text-hover-primary mb-1"
                        style={{ textAlign: "left" }}
                      >
                        {office.name} {office.name}
                      </a>
                      <span>{office.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
              onClick={onDecline}
            >
              İptal
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onApproval}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { OfficeDeleteModal }
