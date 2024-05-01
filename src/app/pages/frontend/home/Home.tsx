import "./Home.css"

import { KYHeader } from "./components/KYHeader/KYHeader"
import { KYHero } from "./components/KYHero/KYHero"
import { KYServices } from "./components/KYServices/KYServices"

const Home = () => {
  return (
    <>
      <KYHeader />
      <main className="ky-home-wrapper">
        <KYHero />
        <KYServices />
      </main>
    </>
  )
}

export { Home }
