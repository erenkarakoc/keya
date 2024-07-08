import "./KYInput.css"
import { ReactPropTypes, ChangeEvent, useState } from "react"
import { AsYouType } from "libphonenumber-js"

interface KYInputProps {
  id: string
  name?: string
  type: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  success?: boolean
  error?: boolean
  phoneInput?: string
  props?: ReactPropTypes
}

const KYInput: React.FC<KYInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
  success,
  error,
  phoneInput,
  props,
}) => {
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(
    phoneInput ? phoneInput : "+90"
  )
  const [countryCode, setCountryCode] = useState("TR")

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const asYouType = new AsYouType()
    const formatted = asYouType.input(e.target.value)
    const countryCode = asYouType.getNumber()?.country

    setCurrentPhoneNumber(formatted)
    setCountryCode(countryCode ? countryCode : "")
  }

  const status = success ? " success" : error ? " error" : ""

  return (
    <div
      className={`ky-input${status && status} ${
        phoneInput && "ky-phone-input"
      } ${countryCode && "has-country-code"}`}
    >
      <input
        id={id}
        name={name}
        type={type}
        placeholder={`${placeholder}${required ? " *" : ""}`}
        value={phoneInput ? currentPhoneNumber : value}
        onChange={(e) => {
          if (onChange) onChange(e)
          if (phoneInput) handlePhoneNumberChange(e)
        }}
        required={required}
        {...props}
      />
      {phoneInput && (
        <span
          className={`fi fi-${countryCode?.toLowerCase()} position-absolute`}
          style={{ top: "50%", transform: "translateY(-50%)", left: "12px" }}
        ></span>
      )}
    </div>
  )
}

export { KYInput }
