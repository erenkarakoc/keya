import { useIntl } from "react-intl"
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub"
import { AsideMenuItem } from "./AsideMenuItem"

export function AsideMenuMain() {
  const intl = useIntl()

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
        to=""
        title="İlan Yönetimi"
        fontIcon="bi-sticky"
        icon="black-right"
      >
        <AsideMenuItem
          to=""
          icon="black-right"
          title="Tüm İlanlar"
          fontIcon="bi-layers"
        />
        <AsideMenuItem
          to=""
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

      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Silinecek
          </span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to="crafted/pages"
        title="Sayfalar"
        fontIcon="bi-archive"
        icon="black-right"
      >
        <AsideMenuItemWithSub
          to="crafted/pages/profile"
          title="Hesap"
          hasBullet={true}
        >
          <AsideMenuItem
            to="crafted/pages/profile/overview"
            title="Genel"
            hasBullet={true}
          />
          <AsideMenuItem
            to="crafted/pages/profile/projects"
            title="Projeler"
            hasBullet={true}
          />
          <AsideMenuItem
            to="crafted/pages/profile/campaigns"
            title="Kampanyalar"
            hasBullet={true}
          />
          <AsideMenuItem
            to="crafted/pages/profile/documents"
            title="Dökümanlar"
            hasBullet={true}
          />
          <AsideMenuItem
            to="crafted/pages/profile/connections"
            title="Bağlantılar"
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub
          to="crafted/pages/wizards"
          title="Hesap Oluşturma"
          hasBullet={true}
        >
          <AsideMenuItem
            to="crafted/pages/wizards/horizontal"
            title="Yatay"
            hasBullet={true}
          />
          <AsideMenuItem
            to="crafted/pages/wizards/vertical"
            title="Dikey"
            hasBullet={true}
          />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to="crafted/accounts"
        title="Hesap"
        icon="black-right"
        fontIcon="bi-person"
      >
        <AsideMenuItem
          to="crafted/account/overview"
          title="Profil"
          hasBullet={true}
        />
        <AsideMenuItem
          to="crafted/account/settings"
          title="Hesap Ayarları"
          hasBullet={true}
        />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to="error"
        title="Hatalar"
        fontIcon="bi-sticky"
        icon="black-right"
      >
        <AsideMenuItem to="error/404" title="404 Hatası" hasBullet={true} />
        <AsideMenuItem to="error/500" title="500 Hatası" hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to="crafted/widgets"
        title="Bileşenler"
        icon="black-right"
        fontIcon="bi-layers"
      >
        <AsideMenuItem
          to="crafted/widgets/lists"
          title="Listeler"
          hasBullet={true}
        />
        <AsideMenuItem
          to="crafted/widgets/statistics"
          title="İstatistikler"
          hasBullet={true}
        />
        <AsideMenuItem
          to="crafted/widgets/charts"
          title="Grafikler"
          hasBullet={true}
        />
        <AsideMenuItem
          to="crafted/widgets/mixed"
          title="Karışık"
          hasBullet={true}
        />
        <AsideMenuItem
          to="crafted/widgets/tables"
          title="Tablolar"
          hasBullet={true}
        />
        <AsideMenuItem
          to="crafted/widgets/feeds"
          title="Akış"
          hasBullet={true}
        />
      </AsideMenuItemWithSub>
    </>
  )
}
