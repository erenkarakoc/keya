import { Outlet } from "react-router-dom"

import "../../_metronic/assets/fonts/fonts.css"
import "../../_metronic/assets/theme.css"
import "../../_metronic/assets/skeletons.css"

import { KYFooter } from "./components/KYFooter/KYFooter"
import { KYHeader } from "./components/KYHeader/KYHeader"

const FrontendLayout = () => {
  return (
    <div className={`ky-layout ky-dark-layout`}>
      <KYHeader />
      <Outlet />
      <KYFooter />
    </div>
  )
}

export { FrontendLayout }
