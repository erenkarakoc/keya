import "./ConfirmationModal.css"
import React from "react"

interface ConfirmationModalProps {
  id: string
  title?: string
  description?: string
  onApproval?: () => void
  onDecline?: () => void
  ExtraComponent?: React.ComponentType
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  id,
  title,
  description,
  onApproval,
  onDecline,
  ExtraComponent,
}) => {
  return (
    <div className="modal fade" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder m-0">{title}</h2>
          </div>

          <div className="modal-body">
            <p>{description}</p>

            <br />

            {ExtraComponent && <ExtraComponent />}
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
              className="btn btn-primary"
              onClick={onApproval}
            >
              Devam Et
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ConfirmationModal }
