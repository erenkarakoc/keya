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
    search: toAbsoluteUrl("src/_metronic/assets/ky-icons/search-icon.svg"),
    gear: toAbsoluteUrl("src/_metronic/assets/ky-icons/gear-icon.svg"),
    house: toAbsoluteUrl("src/_metronic/assets/ky-icons/house-icon.svg"),
    project: toAbsoluteUrl("src/_metronic/assets/ky-icons/project-icon.svg"),
    shop: toAbsoluteUrl("src/_metronic/assets/ky-icons/shop-icon.svg"),
    map: toAbsoluteUrl("src/_metronic/assets/ky-icons/map-icon.svg"),
    badge: toAbsoluteUrl("src/_metronic/assets/ky-icons/badge-icon.svg"),
    city: toAbsoluteUrl("src/_metronic/assets/ky-icons/city-icon.svg"),
    office: toAbsoluteUrl("src/_metronic/assets/ky-icons/office-icon.svg"),
    agent: toAbsoluteUrl("src/_metronic/assets/ky-icons/agent-icon.svg"),
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
