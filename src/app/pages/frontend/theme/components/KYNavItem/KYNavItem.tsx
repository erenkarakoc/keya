import "./KYNavItem.css"
import { Link } from "react-router-dom"

interface KYNavItemProps {
  to: string
  text: string
}

const KYNavItem: React.FC<KYNavItemProps> = ({ to, text }) => {
  return (
    <li className="ky-nav-item">
      <Link to={to}>{text}</Link>
    </li>
  )
}

export { KYNavItem }
