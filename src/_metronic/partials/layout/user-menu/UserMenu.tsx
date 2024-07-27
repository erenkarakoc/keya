import { Link } from "react-router-dom"
import { useAuth } from "../../../../app/modules/auth"
import { toAbsoluteUrl } from "../../../helpers"
// import { Languages } from "../header-menus/Languages"

const UserMenu = () => {
  const { currentUser, logout } = useAuth()
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      {/* begin::Menu item */}
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          {/* begin::Avatar */}
          <div className="symbol symbol-50px me-5">
            <img
              src={
                currentUser?.photoURL
                  ? currentUser?.photoURL
                  : toAbsoluteUrl("media/svg/avatars/blank.svg")
              }
              alt="avatar"
            />
          </div>
          {/* end::Avatar */}

          {/* begin::Username */}
          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <span className="fw-bold text-muted fs-7">
              {currentUser?.email}
            </span>
          </div>
          {/* end::Username */}
        </div>
      </div>
      {/* end::Menu item */}

      {/* begin::Menu separator */}
      <div className="separator my-2"></div>
      {/* end::Menu separator */}

      {/* begin::Menu item */}
      <div className="menu-item px-5">
        <Link
          to={`/arayuz/kullanici-detayi/${currentUser?.id}/genel`}
          className="menu-link px-5"
        >
          Profilim
        </Link>
      </div>
      {/* end::Menu item */}

      {/* begin::Menu item */}
      <div className="menu-item px-5">
        <a
          href={`/arayuz/kullanici-detayi/${currentUser?.id}/portfoyler`}
          className="menu-link px-5"
        >
          <span className="menu-text">Portföylerim</span>
        </a>
      </div>
      {/* end::Menu item */}

      {/* begin::Menu separator */}
      <div className="separator my-2"> </div>
      {/* end::Menu separator */}

      {/* <Languages languageMenuPlacement="right-end" /> */}

      {/* begin::Menu item */}
      <div className="menu-item px-5 my-1">
        <Link
          to={`/arayuz/kullanici-detayi/${currentUser?.id}/duzenle`}
          className="menu-link px-5"
        >
          Hesap Ayarları
        </Link>
      </div>
      {/* end::Menu item */}

      {/* begin::Menu item */}
      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          Çıkış Yap
        </a>
      </div>
    </div>
  )
}

export { UserMenu }
