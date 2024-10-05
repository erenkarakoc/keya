import "./KYText.css"
import { ReactNode } from "react"

interface KYTextProps {
  variant?:
    | "heading"
    | "title"
    | "subtitle"
    | "caption"
    | "paragraph"
    | "uppercase-spaced"
  className?: string
  children?: ReactNode
  color?: string
  fontSize?: number
  fontWeight?: number
  textAlign?: "left" | "right" | "center"
}

const KYText: React.FC<KYTextProps> = ({
  variant,
  className,
  children,
  color,
  fontSize,
  fontWeight,
  textAlign,
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
      className={`ky-text ky-${variant}${className ? " " + className : ""}`}
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign,
      }}
    >
      {children}
    </Tag>
  )
}

export { KYText }
