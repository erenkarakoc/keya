import { ReactPropTypes } from "react"
import "./KYInput.css"

interface KYInputProps {
  id: string
  type: string
  value?: string
  setValue?: () => void
  placeholder?: string
  required?: boolean
  success?: boolean
  error?: boolean
  props?: ReactPropTypes
}

const KYInput: React.FC<KYInputProps> = ({
  id,
  type,
  value,
  setValue,
  placeholder,
  required,
  success,
  error,
  props,
}) => {
  const status = success ? " success" : error ? " error" : ""

  return (
    <div className={`ky-input${status && status}`}>
      <input
        type={type}
        id={id}
        placeholder={`${placeholder}${required ? " *" : ""}`}
        value={value}
        onChange={setValue}
        required={required}
        {...props}
      />
    </div>
  )
}

export { KYInput }
