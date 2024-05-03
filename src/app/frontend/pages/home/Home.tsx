import "./Home.css"

import { KYHero } from "./components/KYHero/KYHero"
import { KYServices } from "./components/KYServices/KYServices"

const Home = () => {
  return (
    <>
      <main className="ky-home-wrapper">
        <KYHero />
        <KYServices />
      </main>
    </>
  )
}

export { Home }
