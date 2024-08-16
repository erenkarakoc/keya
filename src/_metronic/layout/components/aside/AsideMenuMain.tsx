import { useIntl } from "react-intl"
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub"
import { AsideMenuItem } from "./AsideMenuItem"
import { useAuth } from "../../../../app/modules/auth"

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser, logout } = useAuth()

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
        {currentUser?.role === "admin" ||
        currentUser?.role === "broker" ||
        currentUser?.role === "assistant" ||
        currentUser?.role === "human-resources" ? (
          <>
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
          </>
        ) : (
          ""
        )}
      </AsideMenuItemWithSub>

      {currentUser?.role === "admin" ||
      currentUser?.role === "broker" ||
      currentUser?.role === "assistant" ? (
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
      ) : (
        ""
      )}

      {currentUser?.role === "admin" ||
      currentUser?.role === "broker" ||
      currentUser?.role === "assistant" ||
      currentUser?.role === "franchise-manager" ? (
        <AsideMenuItemWithSub
          to="ofis-yonetimi/ofisler"
          title="Ofis Yönetimi"
          fontIcon="bi-sticky"
          icon="black-right"
        >
          {currentUser?.role === "broker" ||
          currentUser?.role === "assistant" ? (
            <>
              <AsideMenuItem
                to={`ofis-detayi/${currentUser.officeId}/genel`}
                icon="black-right"
                title="Genel"
                fontIcon="bi-layers"
              />
              <AsideMenuItem
                to={`ofis-detayi/${currentUser.officeId}/portfoyler`}
                icon="black-right"
                title="Portföyler"
                fontIcon="bi-layers"
              />
              <AsideMenuItem
                to={`ofis-detayi/${currentUser.officeId}/yorumlar`}
                icon="black-right"
                title="Müşteri Yorumları"
                fontIcon="bi-layers"
              />
              <AsideMenuItem
                to={`ofis-detayi/${currentUser.officeId}/duzenle`}
                icon="black-right"
                title="Düzenle"
                fontIcon="bi-layers"
              />
            </>
          ) : (
            ""
          )}

          {currentUser?.role === "admin" ||
          currentUser?.role === "franchise-manager" ? (
            <>
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
            </>
          ) : (
            ""
          )}
        </AsideMenuItemWithSub>
      ) : (
        ""
      )}

      {currentUser?.role === "admin" ||
      currentUser?.role === "broker" ||
      currentUser?.role === "assistant" ||
      currentUser?.role === "human-resources" ||
      currentUser?.role === "franchise-manager" ? (
        <>
          <div className="menu-item">
            <div className="menu-content pt-8 pb-2">
              <span className="menu-section text-muted text-uppercase fs-8 ls-1">
                Başvurular
              </span>
            </div>
          </div>

          {currentUser?.role === "admin" ||
          currentUser?.role === "broker" ||
          currentUser?.role === "assistant" ? (
            <AsideMenuItem
              to="ilan-basvurulari"
              icon="black-right"
              title="İlan"
              fontIcon="bi-layers"
            />
          ) : (
            ""
          )}
          {currentUser?.role === "admin" ||
          currentUser?.role === "broker" ||
          currentUser?.role === "assistant" ||
          currentUser?.role === "human-resources" ? (
            <AsideMenuItem
              to=""
              icon="black-right"
              title="Danışman"
              fontIcon="bi-layers"
            />
          ) : (
            ""
          )}
          {currentUser?.role === "admin" ||
          currentUser?.role === "broker" ||
          currentUser?.role === "assistant" ||
          currentUser?.role === "franchise-manager" ? (
            <AsideMenuItem
              to="franchise-basvurulari"
              icon="black-right"
              title="Franchise"
              fontIcon="bi-layers"
            />
          ) : (
            ""
          )}
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
            title="Ofis Muhasebesi"
            fontIcon="bi-sticky"
            icon="black-right"
          >
            <AsideMenuItem
              to="ofis-islemleri"
              icon="black-right"
              title="Ofis İşlemleri"
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
              to="danisman-islemleri"
              icon="black-right"
              title="Danışman İşlemleri"
              fontIcon="bi-layers"
            />
            <AsideMenuItem
              to="idari-kadro-islemleri"
              icon="black-right"
              title="İdari Kadro İşlemleri"
              fontIcon="bi-layers"
            />
          </AsideMenuItemWithSub>
        </>
      ) : (
        ""
      )}

      {currentUser?.role === "agent" ? (
        <>
          <div className="menu-item">
            <div className="menu-content pt-8 pb-2">
              <span className="menu-section text-muted text-uppercase fs-8 ls-1">
                Hesap
              </span>
            </div>
          </div>
          <AsideMenuItem
            to={`/arayuz/kullanici-detayi/${currentUser?.id}/genel`}
            title="Profilim"
          />
          <AsideMenuItem
            to={`/arayuz/kullanici-detayi/${currentUser?.id}/portfoyler`}
            title="Portföylerim"
          />
          <AsideMenuItem
            to={`/arayuz/kullanici-detayi/${currentUser?.id}/duzenle`}
            title="Hesap Ayarları"
          />
          <div className="menu-item">
            <a className="menu-link" onClick={logout}>
              <span className="menu-title">Çıkış Yap</span>
            </a>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  )
}
