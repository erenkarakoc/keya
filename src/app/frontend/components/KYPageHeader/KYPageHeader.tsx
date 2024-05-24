import "./KYPageHeader.css"

import { KYText } from "../KYText/KYText"
import { KYBGPattern } from "../KYBGPattern/KYBGPattern"

interface KYPageHeaderProps {
  title: string
  subtitle: string
}

const KYPageHeader: React.FC<KYPageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="ky-page-header">
      <KYBGPattern type={1} height={722} width={722} />

      <KYText variant="title" fontWeight={600}>
        {title}
      </KYText>
      <KYText variant="subtitle" fontSize={20}>
        {subtitle}
      </KYText>
    </div>
  )
}

export { KYPageHeader }
