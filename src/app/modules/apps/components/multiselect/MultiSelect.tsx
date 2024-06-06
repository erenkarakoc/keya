import { useFormikContext } from "formik"
import "./MultiSelect.css"
import React, { useState, useEffect, useRef } from "react"

interface Option {
  id: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  id: string
  name: string
  className?: string
  notFoundText?: string
  defaultValue?: { id: string; label: string }[]
  disabled?: boolean
  placeholder?: string
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  id,
  name,
  notFoundText,
  defaultValue,
  disabled,
  placeholder,
}) => {
  const [dropdownActive, setDropdownActive] = useState<boolean>(false)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [searchText, setSearchText] = useState<string>("")

  const { setFieldValue } = useFormikContext()

  const dropdownRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOptionClick = (option: Option) => {
    if (
      selectedOptions.some((selectedOption) => selectedOption.id === option.id)
    ) {
      setSelectedOptions(
        selectedOptions.filter(
          (selectedOption) => selectedOption.id !== option.id
        )
      )
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
    setDropdownActive(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const selectedOption = options.find(
        (option) => option.label.toLowerCase() === searchText.toLowerCase()
      )
      if (selectedOption) {
        handleOptionClick(selectedOption)
        setSearchText("")
      }
    }

    if (event.key === "Backspace") {
      if (searchText === "" && selectedOptions.length > 0) {
        const latestOption = selectedOptions[selectedOptions.length - 1]
        const newSelectedOptions = selectedOptions.filter(
          (option) => option.id !== latestOption.id
        )
        setSelectedOptions(newSelectedOptions)
      }
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !(dropdownRef.current as unknown as HTMLUListElement).contains(
        event.target as Node
      )
    ) {
      setDropdownActive(false)
    }
  }

  const handleWrapperClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (defaultValue) setSelectedOptions(defaultValue)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [defaultValue])

  useEffect(() => {
    const optionsArr: string[] = []

    selectedOptions.map((option) => {
      optionsArr.push(option.id)
    })

    setFieldValue(name, optionsArr)
  }, [name, setFieldValue, selectedOptions])

  return (
    <div
      className={`ky-ms${dropdownActive ? " ky-ms-active" : ""}`}
      onClick={handleWrapperClick}
    >
      <div
        className="form-select form-select-solid form-select-lg"
        onClick={() => setDropdownActive(!dropdownActive)}
      >
        <div className="ky-ms-tags">
          {selectedOptions.map((option) => (
            <div className="ky-ms-tag" key={option.id}>
              {option.label}
              <span
                className="ky-ms-tag-remove"
                onClick={() => handleOptionClick(option)}
              >
                &times;
              </span>
            </div>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="ky-ms-input"
          onClick={() => setDropdownActive(!dropdownActive)}
        />
      </div>

      <ul
        ref={dropdownRef}
        className={`ky-ms-dropdown form-control${
          dropdownActive ? " ky-ms-dropdown-active" : ""
        }`}
      >
        {options
          .filter((option) =>
            option.label.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((option) => (
            <label
              className="form-check form-check-sm form-check-custom form-check-solid"
              htmlFor={"ky-ms-checkbox-" + option.id}
              key={option.id}
            >
              <li
                onClick={() => handleOptionClick(option)}
                className={`form-control form-control-solid${
                  selectedOptions.some(
                    (selectedOption) => selectedOption.id === option.id
                  )
                    ? " ky-ms-selected"
                    : ""
                }`}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={"ky-ms-checkbox-" + option.id}
                  checked={selectedOptions.some(
                    (selectedOption) => selectedOption.id === option.id
                  )}
                  readOnly
                />
                <span className="form-check-label">{option.label}</span>
              </li>
            </label>
          ))}

        {options.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase())
        ).length === 0 && (
          <span className="form-control form-control-solid fw-lighter">
            {notFoundText
              ? notFoundText
              : "Aramanızla eşleşen bir şey bulunamadı"}
          </span>
        )}
      </ul>
      <input
        type="text"
        className="form-control form-control-lg form-control-solid d-none"
        id={id}
        name={name}
        disabled={disabled ? disabled : false}
        placeholder={placeholder ? placeholder : ""}
      />
    </div>
  )
}

export default MultiSelect
