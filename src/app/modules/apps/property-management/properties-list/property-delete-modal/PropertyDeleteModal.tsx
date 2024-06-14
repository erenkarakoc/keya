import "./PropertyDeleteModal.css"

import React, { useEffect, useState } from "react"

import { Property } from "../../_core/_models"

interface PropertyDeleteModalProps {
  id: string
  title?: string
  description?: string
  onApproval?: () => void
  onDecline?: () => void
  selectedPropertiesForDelete?: Property[]
}

const PropertyDeleteModal: React.FC<PropertyDeleteModalProps> = ({
  id,
  title,
  description,
  onApproval,
  onDecline,
  selectedPropertiesForDelete,
}) => {
  const [propertiesArray, setPropertiesArray] = useState<Property[]>([])

  useEffect(() => {
    selectedPropertiesForDelete &&
      setPropertiesArray(selectedPropertiesForDelete)
  }, [selectedPropertiesForDelete])

  return (
    <div className="modal fade" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder m-0">{title}</h2>
          </div>

          <div className="modal-body">
            <p>{description}</p>

            {selectedPropertiesForDelete && (
              <div className="confirmation-modal-properties">
                {propertiesArray.map((property) => (
                  <a
                    href="#"
                    target="_blank"
                    className="d-flex align-items-center confirmation-modal-property"
                    key={property.id}
                  >
                    <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                      <div className="symbol-label">
                        <img
                          src={`${property.propertyDetails.photoURLs[0]}`}
                          alt={property.title}
                          className="w-100"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <a
                        href="#"
                        className="text-gray-800 text-hover-primary mb-1"
                        style={{ textAlign: "left" }}
                      >
                        {property.title}
                      </a>
                    </div>
                  </a>
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
              data-bs-dismiss="modal"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PropertyDeleteModal }
