import { Link, Outlet } from "react-router-dom"

import { useThemeMode } from "../../../_metronic/partials/layout/theme-mode/ThemeModeProvider"
import "../../../_metronic/assets/fonts/fonts.css"
import "./theme/Theme.css"

const FrontendLayout = () => {
  const { mode } = useThemeMode()

  return (
    <div
      className={`ky-layout ${
        mode === "light" ? "ky-light-layout" : "ky-dark-layout"
      }`}
    >
      <Outlet />

      <div
        style={{ display: "flex", flexDirection: "column", gridGap: "20px" }}
      >
        <Link to="/">Ana Sayfa</Link>
        <Link to="/offices">Ofislerimiz</Link>
        <Link to="/theme">Theme</Link>
        <Link to="/auth">Giriş Yap</Link>
      </div>
    </div>
  )
}

export { FrontendLayout }
