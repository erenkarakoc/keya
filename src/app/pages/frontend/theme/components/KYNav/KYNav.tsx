import "./KYNav.css"
import { ReactNode } from "react"

interface KYNavProps {
  children: ReactNode
}

const KYNav: React.FC<KYNavProps> = ({ children }) => {
  return (
    <nav className="ky-nav">
      <ul>{children}</ul>
    </nav>
  )
}

export { KYNav }
