import "./KYCheckbox.css"
import { ReactPropTypes } from "react"

interface KYCheckboxProps {
  id: string
  name?: string
  value?: string
  setValue?: () => void
  label: React.ReactNode
  required?: boolean
  success?: boolean
  error?: boolean
  props?: ReactPropTypes
}

const KYCheckbox: React.FC<KYCheckboxProps> = ({
  id,
  name,
  value,
  setValue,
  label,
  required,
  success,
  error,
  props,
}) => {
  const status = success ? " success" : error ? " error" : ""

  return (
    <div className={`ky-checkbox${status && status}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        onChange={setValue}
        required={required}
        {...props}
      />
      <span></span>
      <label className="ky-checkbox-label" htmlFor={id}>
        {label}
        {required && <div className="ky-checkbox-required"> *</div>}
      </label>
    </div>
  )
}

export { KYCheckbox }
