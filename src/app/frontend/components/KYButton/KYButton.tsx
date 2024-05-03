import "./KYButton.css"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import clsx from "clsx"
import { checkIsActive } from "../../../../_metronic/helpers"

interface KYButtonProps {
  link?: boolean
  to: string
  action?: () => void
  text: string
  secondary?: boolean
  width?: string
  className?: string
}

const KYButton: React.FC<KYButtonProps> = ({
  link,
  to,
  action,
  text,
  secondary,
  width,
  className,
  ...props
}) => {
  const { pathname } = useLocation()

  return (
    <div
      className={`ky-button${secondary ? " ky-button-secondary" : ""}${
        className ? " " + className : ""
      }`}
      style={{ width: width ? width : "" }}
      {...props}
    >
      {link ? (
        <Link
          className={clsx("menu-link py-3", {
            active: checkIsActive(pathname, to),
          })}
          to={to}
        >
          {text}
        </Link>
      ) : (
        <button onClick={action}>{text}</button>
      )}
    </div>
  )
}

export { KYButton }
