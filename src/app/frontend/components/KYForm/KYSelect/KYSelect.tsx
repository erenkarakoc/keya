import "./KYSelect.css"

import { ReactPropTypes } from "react"

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
  props?: ReactPropTypes
}

const KYSelect: React.FC<KYSelectProps> = ({
  id,
  options,
  defaultValue,
  required,
  success,
  error,
  onChange,
  props,
}) => {
  const status = success ? " success" : error ? " error" : ""

  return (
    <div className={`ky-select${status && status} `}>
      <select
        id={id}
        required={required}
        onChange={onChange}
        {...props}
      >
        <option hidden></option>
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
    </div>
  )
}

export { KYSelect }
