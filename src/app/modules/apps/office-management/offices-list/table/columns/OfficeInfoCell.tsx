import clsx from "clsx"
import { FC } from "react"
import { User } from "../../core/_models"

type Props = {
  user: User
}

const OfficeInfoCell: FC<Props> = ({ user }) => {
  const initials =
    user.first_name && user.last_name
      ? user.first_name.charAt(0) + user.last_name.charAt(0)
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
                alt={user.first_name}
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
          {user.first_name} {user.last_name}
        </a>
        <span>{user.email}</span>
      </div>
    </div>
  )
}

export { OfficeInfoCell }
