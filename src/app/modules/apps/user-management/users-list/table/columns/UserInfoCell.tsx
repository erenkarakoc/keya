import clsx from "clsx"
import { FC } from "react"
import { User } from "../../../_core/_models"

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({ user }) => {
  const initials =
    user.firstName && user.lastName
      ? user.firstName.charAt(0) + user.lastName.charAt(0)
      : ""

  return (
    <div className="d-flex align-items-center">
      {/* begin:: Avatar */}
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
            <div className={clsx("symbol-label fs-3")}>{initials}</div>
          )}
        </a>
      </div>
      <div className="d-flex flex-column">
        <a href="#" className="text-gray-800 text-hover-primary mb-1">
          {user.firstName} {user.lastName}
        </a>
        <span>{user.email}</span>
      </div>
    </div>
  )
}

export { UserInfoCell }
