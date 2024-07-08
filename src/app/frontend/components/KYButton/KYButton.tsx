import "./KYButton.css"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import clsx from "clsx"
import { checkIsActive } from "../../../../_metronic/helpers"
import { ReactPropTypes } from "react"

interface KYButtonProps {
  link?: boolean
  to?: string
  action?: () => void
  text: string
  secondary?: boolean
  width?: string
  className?: string
  type?: "button" | "submit" | "reset" | undefined
  props?: ReactPropTypes
  disabled?: boolean
}

const KYButton: React.FC<KYButtonProps> = ({
  to,
  action,
  text,
  secondary,
  width,
  className,
  type,
  disabled,
  ...props
}) => {
  const { pathname } = useLocation()

  return (
    <div
      className={`ky-button${secondary ? " ky-button-secondary" : ""}${
        className ? " " + className : ""
      }${disabled ? " disabled" : ""}`}
      style={{ width: width ? width : "fit-content" }}
      {...props}
    >
      {to ? (
        <Link
          className={clsx("menu-link py-3", {
            active: checkIsActive(pathname, to),
          })}
          to={to}
        >
          {text}
        </Link>
      ) : (
        <button onClick={action} type={type} disabled={disabled}>
          {text}
        </button>
      )}
    </div>
  )
}

export { KYButton }
