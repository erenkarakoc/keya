import { toAbsoluteUrl } from "../../../../_metronic/helpers"

interface KYIconProps {
  name: string
  className?: string
}

interface IconMap {
  [key: string]: string
}

const KYIcon: React.FC<KYIconProps> = ({ name, className }) => {
  const icons: IconMap = {
    search: toAbsoluteUrl("media/ky-icons/search-icon.svg"),
    gear: toAbsoluteUrl("media/ky-icons/gear-icon.svg"),
    house: toAbsoluteUrl("media/ky-icons/house-icon.svg"),
    project: toAbsoluteUrl("media/ky-icons/project-icon.svg"),
    shop: toAbsoluteUrl("media/ky-icons/shop-icon.svg"),
    map: toAbsoluteUrl("media/ky-icons/map-icon.svg"),
    badge: toAbsoluteUrl("media/ky-icons/badge-icon.svg"),
    city: toAbsoluteUrl("media/ky-icons/city-icon.svg"),
    office: toAbsoluteUrl("media/ky-icons/office-icon.svg"),
    agent: toAbsoluteUrl("media/ky-icons/agent-icon.svg"),
  }

  const iconUrl = icons[name]

  return (
    <div
      className={`ky-icon ky-icon-${name}${className ? " " + className : ""}`}
    >
      {iconUrl && <img src={iconUrl} alt={name} />}
    </div>
  )
}

export default KYIcon
