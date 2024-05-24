import { Navigate, Route, Routes } from "react-router-dom"
import { FrontendLayout } from "../frontend/FrontendLayout"

import { Home } from "../frontend/pages/home/Home"
import { Offices } from "../frontend/pages/offices/Offices"
import { Franchise } from "../frontend/pages/franchise/Franchise"

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FrontendLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ofislerimiz" element={<Offices />} />
        <Route path="/franchise" element={<Franchise />} />

        <Route path="*" element={<Navigate to="/hata/404" />} />
      </Route>
    </Routes>
  )
}

export { PublicRoutes }
