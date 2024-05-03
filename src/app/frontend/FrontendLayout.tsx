import { Link, Outlet } from "react-router-dom"

import "../../_metronic/assets/fonts/fonts.css"
import "../../_metronic/assets/theme.css"

const FrontendLayout = () => {
  return (
    <div className={`ky-layout ky-dark-layout`}>
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
