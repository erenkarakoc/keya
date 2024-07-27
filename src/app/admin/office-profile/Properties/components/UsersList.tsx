import { FC, useEffect, useState } from "react"

import { IconUserModel } from "../../ProfileModels"
import { Property } from "../../../../modules/apps/property-management/_core/_models"

import { getUserById } from "../../../../modules/apps/user-management/_core/_requests"
import { getUserNameInitials } from "../../../../../_metronic/helpers/kyHelpers"

type Props = {
  property: Property
  currentUserId: string
}

const UsersList: FC<Props> = ({ property, currentUserId }) => {
  const [otherUsers, setOtherUsers] = useState<IconUserModel[]>()

  useEffect(() => {
    const fetchPropertyAgents = async () => {
      const usersArr = await Promise.all(
        property.userIds.map(async (id) => {
          if (id !== currentUserId) {
            const user = await getUserById(id)
            return {
              id: user?.id ?? "",
              name: user?.firstName + " " + user?.lastName,
              avatar: user?.photoURL ?? "",
              initials:
                user?.photoURL ??
                getUserNameInitials(
                  user?.firstName ?? "",
                  user?.lastName ?? ""
                ),
            } as IconUserModel
          }
          return null
        })
      )

      setOtherUsers(
        usersArr.filter((user): user is IconUserModel => user !== null)
      )
    }

    fetchPropertyAgents()
  }, [property.userIds, currentUserId])

  return (
    otherUsers && (
      <div className="d-flex flex-column mt-5">
        <span className="mb-4 text-gray-500 fw-bold">
          Diğer Yetkili Danışmanlar
        </span>

        <div className="d-flex gap-1">
          {otherUsers.map((user, i) => {
            if (user.id)
              return (
                <div className="position-relative" key={i}>
                  <a
                    href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                    target="_blank"
                    key={user.id}
                    className="symbol symbol-circle symbol-30px with-tooltip overflow-hidden"
                    style={{
                      border: "2px solid #fff",
                    }}
                  >
                    <div className="symbol-label">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-100"
                        />
                      ) : (
                        <div className="symbol-label fs-3">{user.initials}</div>
                      )}
                    </div>
                  </a>
                  <span className="symbol-tooltip">{user.name}</span>
                </div>
              )
          })}
        </div>
      </div>
    )
  )
}

export { UsersList }
