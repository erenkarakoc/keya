import { Country, City, State } from "./address-helper/_models"

import countries from "./address-helper/countries.json"
import states from "./address-helper/states.json"
import citiesData from "./address-helper/cities.json"

import { formatValue } from "react-currency-input-field"

const cities: City[] = citiesData as City[]

const getCountries = (): Country[] => {
  const countriesArr = countries.map((country) => ({
    id: country.id,
    name: country.name,
    iso3: country.iso3,
    iso2: country.iso2,
    numeric_code: country.numeric_code,
    phone_code: country.phone_code,
    capital: country.capital,
    currency: country.currency,
    currency_name: country.currency_name,
    currency_symbol: country.currency_symbol,
    tld: country.tld,
    native: country.native,
    region: country.region,
    region_id: country.region_id,
    subregion: country.subregion,
    subregion_id: country.subregion_id,
    nationality: country.nationality,
    timezones: country.timezones,
    translations: country.translations,
    latitude: country.latitude,
    longitude: country.longitude,
    emoji: country.emoji,
    emojiU: country.emojiU,
  }))

  return countriesArr
}

const getCountryById = (countryId: number) => {
  const country = countries.filter((country) => {
    country.id === countryId
  })

  return country
}

const getStatesByCountry = (countryId: number): State[] | undefined => {
  const countryStates = states.filter(
    (state: State) =>
      state.country_id === countryId &&
      state.latitude !== null &&
      state.longitude !== null
  )

  if (countryStates.length > 0) {
    return countryStates
  } else {
    return undefined
  }
}

const getCitiesByState = (stateId: number): City[] | undefined => {
  const stateCities = cities.filter((city: City) => city.state_id === stateId)

  if (stateCities.length > 0) {
    return stateCities
  } else {
    return undefined
  }
}

const getUserRoleText = (text: string) => {
  switch (text) {
    case "admin":
      return "Yönetici"
    case "broker":
      return "Broker"
    case "assistant":
      return "Ofis Asistanı"
    case "human-resources":
      return "İnsan Kaynakları"
    case "franchise-manager":
      return "Franchise Yöneticisi"
    case "agent":
      return "Gayrimenkul Danışmanı"
    default:
      ""
  }
}

const getUserNameInitials = (firstName: string, lastName: string) => {
  const initials =
    firstName && lastName ? firstName.charAt(0) + lastName.charAt(0) : ""
  return initials
}

const slugify = (str: string) => {
  const trMap: { [key: string]: string } = {
    çÇ: "c",
    ğĞ: "g",
    şŞ: "s",
    üÜ: "u",
    ıİ: "i",
    öÖ: "o",
  }

  for (const key in trMap) {
    str = str.replace(new RegExp("[" + key + "]", "g"), trMap[key])
  }

  str = str
    .replace(/[^a-zA-Z0-9@.]+/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()

  return str
}

const urlify = (str: string) => {
  const charMap: { [key: string]: string } = {
    à: "a",
    á: "a",
    â: "a",
    ä: "a",
    æ: "a",
    ã: "a",
    å: "a",
    ā: "a",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ē: "e",
    ė: "e",
    ę: "e",
    î: "i",
    ï: "i",
    í: "i",
    ī: "i",
    į: "i",
    ì: "i",
    ô: "o",
    ö: "o",
    ò: "o",
    ó: "o",
    œ: "o",
    ø: "o",
    ō: "o",
    õ: "o",
    û: "u",
    ü: "u",
    ù: "u",
    ú: "u",
    ū: "u",
    ç: "c",
    ć: "c",
    č: "c",
    ł: "l",
    ñ: "n",
    ń: "n",
    ß: "s",
    ś: "s",
    š: "s",
    ť: "t",
    ÿ: "y",
    ý: "y",
    ž: "z",
    ź: "z",
    ż: "z",
    đ: "d",
    ğ: "g",
    ı: "i",
    ş: "s",
    ț: "t",
    ţ: "t",
  }

  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, (match) => charMap[match] || "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

const generateRandomName = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const length = 30
  let randomName = ""

  for (let i = 0; i < length; i++) {
    randomName += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }

  return randomName
}

const formatPrice = (price: string) => {
  const formattedPrice = formatValue({
    value: price,
    intlConfig: { locale: "en-IN", currency: "INR" },
  })

  return formattedPrice
}

export {
  getCountries,
  getCountryById,
  getStatesByCountry,
  getCitiesByState,
  getUserRoleText,
  getUserNameInitials,
  slugify,
  urlify,
  generateRandomName,
  formatPrice,
}
