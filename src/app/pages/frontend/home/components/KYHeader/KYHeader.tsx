import "./KYHeader.css"

import { toAbsoluteUrl } from "../../../../../../_metronic/helpers/AssetHelpers"
import { useThemeMode } from "../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider"
import { Link } from "react-router-dom"

import { KYNav } from "../../../theme/components/KYNav/KYNav"
import { KYNavItem } from "../../../theme/components/KYNavItem/KYNavItem"
import { KYButton } from "../../../theme/components/KYButton/KYButton"

const KYHeader = () => {
  const { mode } = useThemeMode()

  return (
    <header className="ky-header">
      <div className="ky-header-wrapper">
        <Link to="/">
          {mode === "light" && (
            <img
              alt="Keya Real Estate"
              className="h-20px logo theme-light-show ms-3"
              src={toAbsoluteUrl("media/logos/logo-light.svg")}
            />
          )}

          {mode === "dark" && (
            <img
              alt="Keya Real Estate"
              className="h-20px logo theme-dark-show ms-3"
              src={toAbsoluteUrl("media/logos/logo-dark.svg")}
            />
          )}
        </Link>

        <KYNav>
          <KYNavItem to="/" text="Ana Sayfa" />
          <KYNavItem to="/sat-kirala" text="Sat & Kirala" />
          <KYNavItem to="/franchise" text="Franchise" />
          <KYNavItem to="/ofislerimiz" text="Ofislerimiz" />
          <KYNavItem to="/kariyer" text="Kariyer" />
          <KYButton link secondary to="/iletisim" text="İletişim" />
        </KYNav>
      </div>
    </header>
  )
}

export { KYHeader }
