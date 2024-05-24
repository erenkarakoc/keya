import "./Home.css"
import { KYHero } from "./components/KYHero/KYHero"
import { KYServices } from "./components/KYServices/KYServices"
import { KYWhyUs } from "./components/KYWhyUs/KYWhyUs"
import { KYTestimonials } from "./components/KYTestimonials/KYTestimonials"
import { KYFeatures } from "./components/KYFeatures/KYFeatures"
import { KYBests } from "./components/KYBests/KYBests"

const Home = () => {
  return (
    <>
      <main className="ky-home-wrapper">
        <KYHero />
        <KYServices />
        <KYBests />
        <KYWhyUs />
        <KYFeatures />
        <KYTestimonials />
      </main>
    </>
  )
}

export { Home }
