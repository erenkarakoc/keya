import "./KYText.css"
import { ReactNode } from "react"

interface KYTextProps {
  variant?: "heading" | "title" | "subtitle" | "caption" | "paragraph"
  className?: string
  children?: ReactNode
  color?: string
  fontSize?: number
  fontWeight?: number
}

const KYText: React.FC<KYTextProps> = ({
  variant,
  className,
  children,
  color,
  fontSize,
  fontWeight,
}) => {
  const Tag =
    variant === "heading"
      ? "h1"
      : variant === "title"
      ? "h3"
      : variant === "subtitle"
      ? "h3"
      : variant === "caption"
      ? "span"
      : "p"

  return (
    <Tag
      className={`ky-text ky-${variant} ${className}`}
      style={{
        color,
        fontSize,
        fontWeight,
      }}
    >
      {children}
    </Tag>
  )
}

export { KYText }
