import "./KYHero.css"
import { KYText } from "../../../theme/components/KYText/KYText"
import { KYBGPattern } from "../../../theme/components/KYBGPattern/KYBGPattern"
import { KYHeroSearchInput } from "../KYHeroSearchInput/KYHeroSearchInput"
import { Link } from "react-router-dom"

const KYHero = () => {
  return (
    <section className="ky-hero-section">
      <KYBGPattern type={1} />
      <KYText className="ky-hero-heading" variant="heading">
        Hayalindeki <span className="ky-text-highlight">mülkü bulmak</span> hiç
        bu kadar kolay olmamıştı!
      </KYText>
      <KYHeroSearchInput />
      <KYText className="ky-hero-caption" variant="caption">
        Franchise programımıza katıl, kendi işinin sahibi ol!{" "}
        <Link to="/franchise">Daha fazla bilgi</Link> →
      </KYText>
    </section>
  )
}

export { KYHero }
