import { useIntl } from "react-intl"
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub"
import { AsideMenuItem } from "./AsideMenuItem"
import { useAuth } from "../../../../app/modules/auth"

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser } = useAuth()

  return (
    <>
      <AsideMenuItem
        to=""
        title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
        fontIcon="bi-app-indicator"
      />
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Yönetim
          </span>
        </div>
      </div>

      <AsideMenuItemWithSub
        to="kullanici-yonetimi/kullanicilar"
        title="Kullanıcı Yönetimi"
        fontIcon="bi-sticky"
        icon="black-right"
      >
        <AsideMenuItem
          to="kullanici-yonetimi/kullanicilar"
          icon="black-right"
          title="Tüm Kullanıcılar"
          fontIcon="bi-layers"
        />
        <AsideMenuItem
          to="kullanici-yonetimi/kullanici-ekle"
          icon="black-right"
          title="Kullanıcı Ekle"
          fontIcon="bi-layers"
        />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to="ilan-yonetimi/ilanlar"
        title="İlan Yönetimi"
        fontIcon="bi-sticky"
        icon="black-right"
      >
        <AsideMenuItem
          to="ilan-yonetimi/ilanlar"
          icon="black-right"
          title="Tüm İlanlar"
          fontIcon="bi-layers"
        />
        <AsideMenuItem
          to="ilan-yonetimi/ilan-ekle"
          icon="black-right"
          title="İlan Ekle"
          fontIcon="bi-layers"
        />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to="ofis-yonetimi/ofisler"
        title="Ofis Yönetimi"
        fontIcon="bi-sticky"
        icon="black-right"
      >
        <AsideMenuItem
          to="ofis-yonetimi/ofisler"
          icon="black-right"
          title="Tüm Ofisler"
          fontIcon="bi-layers"
        />
        <AsideMenuItem
          to="ofis-yonetimi/ofis-ekle"
          icon="black-right"
          title="Ofis Ekle"
          fontIcon="bi-layers"
        />
      </AsideMenuItemWithSub>

      {currentUser?.role === "admin" ||
      currentUser?.role === "broker" ||
      currentUser?.role === "human-resources" ? (
        <>
          <div className="menu-item">
            <div className="menu-content pt-8 pb-2">
              <span className="menu-section text-muted text-uppercase fs-8 ls-1">
                İnsan Kaynakları
              </span>
            </div>
          </div>

          <AsideMenuItemWithSub
            to=""
            title="Danışmanlar"
            fontIcon="bi-sticky"
            icon="black-right"
          >
            <AsideMenuItem
              to=""
              icon="black-right"
              title="Başvurular"
              fontIcon="bi-layers"
            />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to=""
            title="Franchise"
            fontIcon="bi-sticky"
            icon="black-right"
          >
            <AsideMenuItem
              to=""
              icon="black-right"
              title="Başvurular"
              fontIcon="bi-layers"
            />
          </AsideMenuItemWithSub>
        </>
      ) : (
        ""
      )}

      {currentUser?.role === "admin" ||
      currentUser?.role === "broker" ||
      currentUser?.role === "assistant" ? (
        <>
          <div className="menu-item">
            <div className="menu-content pt-8 pb-2">
              <span className="menu-section text-muted text-uppercase fs-8 ls-1">
                Muhasebe
              </span>
            </div>
          </div>

          <AsideMenuItemWithSub
            to=""
            title="İlan Muhasebesi"
            fontIcon="bi-sticky"
            icon="black-right"
          >
            <AsideMenuItem
              to=""
              icon="black-right"
              title="Tüm İşlemler"
              fontIcon="bi-layers"
            />
            <AsideMenuItem
              to=""
              icon="black-right"
              title="İşlem Ekle"
              fontIcon="bi-layers"
            />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to=""
            title="Ofis Muhasebesi"
            fontIcon="bi-sticky"
            icon="black-right"
          >
            <AsideMenuItem
              to=""
              icon="black-right"
              title="Ofis Gelir/Gideri"
              fontIcon="bi-layers"
            />
            <AsideMenuItem
              to=""
              icon="black-right"
              title="İşlem Gelir/Gideri"
              fontIcon="bi-layers"
            />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to=""
            title="Kullanıcı Muhasebesi"
            fontIcon="bi-sticky"
            icon="black-right"
          >
            <AsideMenuItem
              to=""
              icon="black-right"
              title="Danışman"
              fontIcon="bi-layers"
            />
            <AsideMenuItem
              to=""
              icon="black-right"
              title="İdari Kadro"
              fontIcon="bi-layers"
            />
          </AsideMenuItemWithSub>
        </>
      ) : (
        ""
      )}
    </>
  )
}
