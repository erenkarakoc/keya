import "./UserDeleteModal.css"

import clsx from "clsx"
import React, { useEffect, useState } from "react"

import { UserModel } from "../../../../auth"

interface UserDeleteModalProps {
  id: string
  title?: string
  description?: string
  onApproval?: () => void
  onDecline?: () => void
  selectedUsersForDelete?: UserModel[]
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  id,
  title,
  description,
  onApproval,
  onDecline,
  selectedUsersForDelete,
}) => {
  const [usersArray, setUsersArray] = useState<UserModel[]>([])

  useEffect(() => {
    selectedUsersForDelete && setUsersArray(selectedUsersForDelete)
  }, [selectedUsersForDelete])

  return (
    <div className="modal fade" id={id} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder m-0">{title}</h2>
          </div>

          <div className="modal-body">
            <p>{description}</p>

            {selectedUsersForDelete && (
              <div className="confirmation-modal-users">
                {usersArray.map((user) => (
                  <div
                    className="d-flex align-items-center confirmation-modal-user"
                    key={user.id}
                  >
                    <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                      <a href="#">
                        {user.photoURL ? (
                          <div className="symbol-label">
                            <img
                              src={`${user.photoURL}`}
                              alt={user.firstName}
                              className="w-100"
                            />
                          </div>
                        ) : (
                          <div className={clsx("symbol-label fs-3")}>
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
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
                        {user.firstName} {user.lastName}
                      </a>
                      <span>{user.email}</span>
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
              data-bs-dismiss="modal"
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

export { UserDeleteModal }
