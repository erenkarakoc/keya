import "./KYFranchiseFeatures.css"

import KYIcon from "../../../components/KYIcon/KYIcon"

const KYFranchiseFeatures = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="ky-franchise-features">
      <div className="ky-franchise-feature">
        <div className="ky-franchise-feature-icon">
          <KYIcon name="badge" />
        </div>
        <div className="ky-franchise-feature-title">{currentYear - 2009}+</div>
        <div className="ky-franchise-feature-desc">Yıllık deneyim</div>
      </div>
      <div className="ky-franchise-feature">
        <div className="ky-franchise-feature-icon">
          <KYIcon name="city" />
        </div>
        <div className="ky-franchise-feature-title">5</div>
        <div className="ky-franchise-feature-desc">Şehir</div>
      </div>
      <div className="ky-franchise-feature">
        <div className="ky-franchise-feature-icon">
          <KYIcon name="office" />
        </div>
        <div className="ky-franchise-feature-title">7</div>
        <div className="ky-franchise-feature-desc">Ofis</div>
      </div>
      <div className="ky-franchise-feature">
        <div className="ky-franchise-feature-icon">
          <KYIcon name="agent" />
        </div>
        <div className="ky-franchise-feature-title">74</div>
        <div className="ky-franchise-feature-desc">Danışman</div>
      </div>
    </div>
  )
}

export { KYFranchiseFeatures }
