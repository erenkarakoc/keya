/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatValue } from "react-currency-input-field"

const apiUrl =
  "https://countries-states-cities-api.netlify.app/.netlify/functions/"

const getCountries = async () => {
  try {
    const response = await fetch(apiUrl + "getCountries")
    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching countries:", error)
    throw error
  }
}

const getStatesByCountry = async (countryId: string) => {
  try {
    const response = await fetch(
      apiUrl + "getStatesByCountry?countryId=" + countryId
    )
    if (!response.ok) {
      throw new Error("Failed to fetch states")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching states:", error)
    throw error
  }
}

const getCitiesByState = async (stateId: string) => {
  try {
    const response = await fetch(apiUrl + "getCitiesByState?stateId=" + stateId)
    if (!response.ok) {
      throw new Error("Failed to fetch cities")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching cities:", error)
    throw error
  }
}

const getCountryById = async (countryId: string) => {
  try {
    const response = await fetch(
      apiUrl + "getCountryById?countryId=" + countryId
    )
    if (!response.ok) {
      throw new Error("Failed to fetch country")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching country:", error)
    throw error
  }
}

const getStateById = async (stateId: string) => {
  try {
    const response = await fetch(apiUrl + "getStateById?stateId=" + stateId)
    if (!response.ok) {
      throw new Error("Failed to fetch state")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching state:", error)
    throw error
  }
}

const getCityById = async (cityId: string) => {
  try {
    const response = await fetch(apiUrl + "getCityById?cityId=" + cityId)
    if (!response.ok) {
      throw new Error("Failed to fetch city")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching city:", error)
    throw error
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
    intlConfig: { locale: "tr-TR", currency: "TRY" },
  })

  return formattedPrice
}

const convertToTurkishDate = (dateStr: string) => {
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ]

  const [year, month, day] = dateStr.split("-")
  const monthIndex = parseInt(month, 10) - 1
  const monthName = months[monthIndex]

  return `${day} ${monthName} ${year}`
}

const timestampToTurkishDate = (timestamp: string) => {
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ]

  const date = new Date(parseInt(timestamp))
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  const monthName = months[month]

  return `${day} ${monthName} ${year}`
}

const getCurrentMonthNameTurkish = (currentDate: Date) => {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  const currentMonth = currentDate.getMonth()

  return months[currentMonth]
}

const timestampToISODate = (timestamp: string) => {
  const date = new Date(Number(timestamp))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const ISODateToTimestamp = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.getTime()
}

const convertPropertyForText = (forString: string) => {
  if (forString === "sale") return "Satılık"
  else if (forString === "rent") return "Kiralık"
  else if (forString === "lease-sale") return "Devren Satılık"
  else if (forString === "lease-rent") return "Devren Kiralık"
  else return ""
}

const convertPropertyTypeText = (typeString: string) => {
  if (typeString === "residence") return "Daire"
  else if (typeString === "land") return "Arsa"
  else if (typeString === "office") return "İş Yeri"
  else if (typeString === "project") return "Proje"
  else return ""
}

const convertPropertyHeatingText = (heatingString: string) => {
  if (heatingString === "stove") return "Soba"
  else if (heatingString === "naturalGasStove") return "Doğalgaz Sobası"
  else if (heatingString === "floorRadiator") return "Kat Kaloriferi"
  else if (heatingString === "central") return "Merkezi"
  else if (heatingString === "centerShareMeter") return "Merkezi (Pay Ölçer)"
  else if (heatingString === "combiBoilerNaturalGas") return "Kombi (Doğalgaz)"
  else if (heatingString === "combiBoilerElectricity") return "Kombi (Elektrik)"
  else if (heatingString === "floorHeating") return "Yerden Isıtma"
  else if (heatingString === "airConditioning") return "Klima"
  else if (heatingString === "fancoilUnit") return "Fancoil Ünitesi"
  else if (heatingString === "solarEnergy") return "Güneş Enerjisi"
  else if (heatingString === "electricRadiator") return "Elektrikli Radyatör"
  else if (heatingString === "geothermal") return "Jeotermal"
  else if (heatingString === "fireplace") return "Şömine"
  else if (heatingString === "VRV") return "VRV"
  else if (heatingString === "heatPump") return "Isı Pompası"
  else return ""
}

const convertPropertyParkingLotText = (parkingLotString: string) => {
  if (parkingLotString === "openNclosedParkingLot")
    return "Açık & Kapalı Otopark"
  else if (parkingLotString === "closedParkingLot") return "Kapalı Otopark"
  else if (parkingLotString === "openParkingLot") return "Açık Otopark"
  else return "Yok"
}

const convertPropertyDeedStatusText = (deedStatusText: string) => {
  if (deedStatusText === "condominium") return "Kat Mülkiyetli"
  else if (deedStatusText === "floorAltitude") return "Kat İrtifaklı"
  else if (deedStatusText === "shareTitleDeed") return "Hisseli Tapulu"
  else if (deedStatusText === "detachedTitleDeed") return "Müstakil Tapulu"
  else if (deedStatusText === "landTitleDeed") return "Arsa Tapulu"
  else return ""
}

export {
  getCountryById,
  getCountries,
  getStateById,
  getStatesByCountry,
  getCityById,
  getCitiesByState,
  getUserRoleText,
  getUserNameInitials,
  slugify,
  urlify,
  generateRandomName,
  formatPrice,
  convertToTurkishDate,
  timestampToTurkishDate,
  getCurrentMonthNameTurkish,
  timestampToISODate,
  ISODateToTimestamp,
  convertPropertyForText,
  convertPropertyTypeText,
  convertPropertyHeatingText,
  convertPropertyParkingLotText,
  convertPropertyDeedStatusText,
}
