import "./Home.css"

import { KYHero } from "./components/KYHero/KYHero"
import { KYWhyUs } from "./components/KYWhyUs/KYWhyUs"
import { KYTestimonials } from "./components/KYTestimonials/KYTestimonials"
import { KYFeatures } from "./components/KYFeatures/KYFeatures"
import { KYBests } from "./components/KYBests/KYBests"

const Home = () => {
  return (
    <>
      <main className="ky-home-wrapper">
        <KYHero />
        <KYFeatures />
        <KYWhyUs />
        <KYBests />
        <KYTestimonials />
      </main>
    </>
  )
}

export { Home }
