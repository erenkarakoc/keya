import { FC } from "react"
import { useAuth } from "../../../../app/modules/auth"
import { KTIcon, toAbsoluteUrl } from "../../../helpers"
import { UserMenu } from "../user-menu/UserMenu"
import { getUserRoleText } from "../../../helpers/kyHelpers"

const AsideUserMenu: FC = () => {
  const { currentUser } = useAuth()

  return (
    <>
      <div className="d-flex flex-stack">
        <div className="d-flex align-items-center">
          <div className="symbol symbol-circle symbol-40px">
            <img
              src={
                currentUser?.photoURL
                  ? currentUser?.photoURL
                  : toAbsoluteUrl("media/svg/avatars/blank.svg")
              }
              alt={currentUser?.firstName + " " + currentUser?.lastName}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="ms-2">
            <a
              href={`/arayuz/kullanici-detayi/${currentUser?.id}/genel`}
              className="text-gray-800 text-hover-primary fs-6 fw-bolder lh-1"
            >
              {currentUser?.firstName} {currentUser?.lastName}
            </a>
            <span className="text-muted fw-bold d-block fs-7 lh-1 mt-1">
              {getUserRoleText(currentUser?.role as string)}
            </span>
          </div>
        </div>

        {currentUser?.role != "agent" ? (
          <div className="ms-1">
            <div
              className="btn btn-sm btn-icon btn-active-color-primary position-relative me-n2"
              data-kt-menu-trigger="click"
              data-kt-menu-overflow="false"
              data-kt-menu-placement="top-end"
            >
              <KTIcon iconName="setting-2" className="fs-1" />
            </div>
            <UserMenu />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export { AsideUserMenu }
