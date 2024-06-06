import { Navigate, Route, Routes } from "react-router-dom"
import { FrontendLayout } from "../frontend/FrontendLayout"

import { Home } from "../frontend/pages/home/Home"
import { Offices } from "../frontend/pages/offices/Offices"
import { Franchise } from "../frontend/pages/franchise/Franchise"
import { SellRent } from "../frontend/pages/sell-rent/SellRent"
import { Career } from "../frontend/pages/career/Career"
import { Agents } from "../frontend/pages/agents/Agents"

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FrontendLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/ofislerimiz" element={<Offices />} />
        <Route path="/danismanlarimiz" element={<Agents />} />
        <Route path="/kariyer" element={<Career />} />
        <Route path="/sat-kirala" element={<SellRent />} />

        <Route path="*" element={<Navigate to="/hata/404" />} />
      </Route>
    </Routes>
  )
}

export { PublicRoutes }
