import { Navigate, Route, Routes } from "react-router-dom"
import { FrontendLayout } from "../frontend/FrontendLayout"

import { Home } from "../frontend/pages/home/Home"
import { Offices } from "../frontend/pages/offices/Offices"
import { Agents } from "../frontend/pages/agents/Agents"
import { Properties } from "../frontend/pages/properties/Properties"
import { Franchise } from "../frontend/pages/franchise/Franchise"
import { SellRent } from "../frontend/pages/sell-rent/SellRent"
import { Career } from "../frontend/pages/career/Career"
import { About } from "../frontend/pages/about/About"

import { AgentDetail } from "../frontend/pages/agent-detail/AgentDetail"
import { OfficeDetail } from "../frontend/pages/office-detail/OfficeDetail"
import { PropertyDetail } from "../frontend/pages/property-detail/PropertyDetail"

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FrontendLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ilanlar" element={<Properties />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/ofislerimiz" element={<Offices />} />
        <Route path="/danismanlarimiz" element={<Agents />} />
        <Route path="/kariyer" element={<Career />} />
        <Route path="/sat-kirala" element={<SellRent />} />
        <Route path="/hakkimizda" element={<About />} />

        {/* Detail Pages */}
        <Route path="/kullanici-detayi/:id/" element={<AgentDetail />} />
        <Route path="/ofis-detayi/:id/" element={<OfficeDetail />} />
        <Route path="/ilan-detayi/:id/" element={<PropertyDetail />} />

        <Route path="*" element={<Navigate to="/hata/404" />} />
      </Route>
    </Routes>
  )
}

export { PublicRoutes }
