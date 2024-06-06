import "./KYSelect.css"

import { ChangeEvent, useState } from "react"

interface Option {
  value: string
  text: string
}

interface KYSelectProps {
  id: string
  options?: Option[]
  defaultValue?: string
  required?: boolean
  success?: boolean
  error?: boolean
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  placeholder?: string
}

const KYSelect: React.FC<KYSelectProps> = ({
  id,
  options,
  defaultValue,
  required,
  success,
  error,
  onChange,
  disabled,
  placeholder,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "")

  const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value)
    onChange && onChange(e)
  }

  const status = success ? " success" : error ? " error" : ""

  return (
    <div
      className={`ky-select${status && status} ${
        selectedValue !== "" ? "has-value" : ""
      }`}
    >
      <select
        id={id}
        required={required}
        onChange={handleOnChange}
        disabled={disabled}
        value={selectedValue}
      >
        <option></option>
        {options &&
          options.map((option, i) => (
            <option
              key={i}
              value={option.value}
              selected={option.value === defaultValue}
            >
              {option.text}
            </option>
          ))}
      </select>
      <span></span>
      {placeholder && (
        <span className="ky-select-placeholder">{placeholder}</span>
      )}
    </div>
  )
}

export { KYSelect }
