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
            Genel
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
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Kullanıcılar
          </span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to="apps/chat"
        title="Chat"
        fontIcon="bi-chat-left"
        icon="black-right"
      >
        <AsideMenuItem
          to="apps/chat/private-chat"
          title="Private Chat"
          hasBullet={true}
        />
        <AsideMenuItem
          to="apps/chat/group-chat"
          title="Group Chart"
          hasBullet={true}
        />
        <AsideMenuItem
          to="apps/chat/drawer-chat"
          title="Drawer Chart"
          hasBullet={true}
        />
      </AsideMenuItemWithSub>
      <AsideMenuItem
        to="kullanici-yonetimi/kullanicilar"
        icon="black-right"
        title="Kullanıcı Yönetimi"
        fontIcon="bi-layers"
      />
    </>
  )
}
