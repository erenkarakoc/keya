import "./Franchise.css"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYFranchiseFeatures } from "./components/KYFranchiseFeatures"
import { KYText } from "../../components/KYText/KYText"
import { KYButton } from "../../components/KYButton/KYButton"

import { toAbsoluteUrl } from "../../../../_metronic/helpers"

const Franchise = () => {
  return (
    <main className="ky-page-franchise">
      <KYPageHeader
        title="Franchise"
        subtitle="Gayrimenkul sektörünün önemli bir parçası olmak ve Keya’nın eşsiz avantajlarından faydalanmak için hemen başlayın."
      />

      <KYFranchiseFeatures />

      <div className="ky-franchise-introduction">
        <KYText className="ky-section-title-center" variant="title">
          Keya <span className="ky-text-highlight">güvencesi</span> ile kendi
          işinizi kurun.
        </KYText>
        <KYText variant="paragraph" textAlign="center">
          Keya'nın yıllar boyunca edindiği deneyimlerden, tanınırlığı ve
          güveninden yararlanarak, seçtiğiniz semtte gayrimenkul danışmanlığı
          hizmeti sunmak ister misiniz? Yapmanız gereken tek şey ilgili formu
          eksiksiz doldurmak!
        </KYText>
        <KYButton secondary to="#franchise_form" text="Formu Doldur" />
        <img
          src={toAbsoluteUrl("media/frontend/franchise/franchise_image.svg")}
          alt="Franchise ol!"
        />
      </div>

      <form action="" id="franchise_form">
        aa
      </form>
    </main>
  )
}

export { Franchise }
