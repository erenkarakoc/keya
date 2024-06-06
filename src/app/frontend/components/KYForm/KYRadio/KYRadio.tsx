import "./KYRadio.css"
import { ReactPropTypes } from "react"

interface KYRadioProps {
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

const KYRadio: React.FC<KYRadioProps> = ({
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
    <div className={`ky-radio${status && status}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={setValue}
        required={required}
        {...props}
      />
      <span></span>
      <label className="ky-radio-label" htmlFor={id}>
        {label}
        {required && <div className="ky-radio-required"> *</div>}
      </label>
    </div>
  )
}

export { KYRadio }
