import { Navigate, Route, Routes } from "react-router-dom"
import { FrontendLayout } from "../pages/frontend/FrontendLayout"

import { Home } from "../pages/frontend/home/Home"
import { Offices } from "../pages/frontend/offices/Offices"
import { Theme } from "../pages/frontend/theme/Theme"

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FrontendLayout />}>
        <Route path="/theme" element={<Theme />} />
        <Route path="/" element={<Home />} />
        <Route path="/offices" element={<Offices />} />

        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  )
}

export { PublicRoutes }
