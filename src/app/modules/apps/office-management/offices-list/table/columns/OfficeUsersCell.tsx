import clsx from "clsx"
import { FC, useEffect, useState } from "react"

import { getUserById } from "../../../../user-management/_core/_requests"
import { User } from "../../../../user-management/_core/_models"

type Props = {
  userIds?: string[]
}

const OfficeUsersCell: FC<Props> = ({ userIds }) => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersArr: User[] = []

        if (userIds) {
          await Promise.all(
            userIds.map(async (id) => {
              const user = await getUserById(id)

              if (
                user &&
                usersArr.length <= 4 &&
                (user.role === "agent" || user.role === "broker" || user.role === "admin")
              ) {
                usersArr.push(user)
              }
            })
          )

          setUsers(usersArr)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [userIds])

  return (
    <div className="d-flex gap-3">
      {users.map((user, i) => {
        const initials =
          user.firstName && user.lastName
            ? user.firstName.charAt(0) + user.lastName.charAt(0)
            : ""

        return (
          <div className="position-relative" key={i}>
            <a
              href={`/arayuz/kullanici-detayi/${user.id}/genel`}
              target="_blank"
              key={user.id}
              className="symbol symbol-circle symbol-30px with-tooltip overflow-hidden"
              style={{
                marginRight: -20,
                border: "2px solid #fff",
              }}
            >
              <div className="symbol-label">
                {user.photoURL ? (
                  <img
                    src={`${user.photoURL}`}
                    alt={user.firstName}
                    className="w-100"
                  />
                ) : (
                  <div
                    className={clsx(
                      "symbol-label fs-9 fw-bolder bg-primary text-white"
                    )}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </a>
            <span className="symbol-tooltip">
              {`${user.firstName} ${user.lastName}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { OfficeUsersCell }
