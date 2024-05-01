import "./KYHeroSearchInput.css"
import React, { useState } from "react"
import KYIcon from "../../../theme/components/KYIcon/KYIcon"

const KYHeroSearchInput = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const onHeroSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()

    const inputElement = e.target as HTMLInputElement
    console.log("onKeyUp: " + inputElement.value)

    if (inputElement.value) setHasValue(true)
    else setHasValue(false)
  }

  const onHeroSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const inputValue = (
      e.target as HTMLFormElement
    ).querySelector<HTMLInputElement>("#KYHeroSearchInput")?.value
    console.log("onSubmit: " + inputValue)
  }

  return (
    <form
      className={`ky-hero-search-input${
        isHovered ? " ky-hero-search-input-hovered" : ""
      }${isFocused ? " ky-hero-search-input-focused" : ""}${
        hasValue ? " ky-hero-search-input-has-value" : ""
      }`}
      onSubmit={onHeroSearchSubmit}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <input
        type="search"
        id="KYHeroSearchInput"
        placeholder="Sana en uygun gayrimenkulü ara..."
        onKeyUp={onHeroSearchKeyUp}
      />
      <KYIcon name="search" />
      <button
        type="button"
        id="KYHeroSearchFilter"
        onClick={() => console.log("Filtreler")}
      >
        <KYIcon name="gear" />
      </button>
      <button type="submit" id="KYHeroSearchButton">
        Ara
      </button>
    </form>
  )
}

export { KYHeroSearchInput }
