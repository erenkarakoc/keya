import "./KYHeroSearchInput.css"
import React, { useEffect, useState } from "react"

import { Property } from "../../../../../modules/apps/property-management/_core/_models"
import { getPropertiesBySearchTerm } from "../../../../../modules/apps/property-management/_core/_requests"
import {
  City,
  Country,
  State,
} from "../../../../../../_metronic/helpers/address-helper/_models"
import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
  toTurkishUpperCase,
} from "../../../../../../_metronic/helpers/kyHelpers"
import { KYSelect } from "../../../../components/KYForm/KYSelect/KYSelect"

interface Option {
  value: string
  text: string
}

const KYHeroSearchInput = () => {
  const [searchLoading, setSearchLoading] = useState(true)
  const [searchResult, setSearchResult] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const [filterListActive, setFilterListActive] = useState(false)

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])
  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const onHeroSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()

    const inputElement = e.target as HTMLInputElement
    setSearchTerm(inputElement.value)

    if (inputElement.value) setHasValue(true)
    else setHasValue(false)
  }

  const onHeroSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let link = "/ilanlar"
    const params = new URLSearchParams()

    const form = e?.currentTarget || document.querySelector("form.ky-form")
    const title = toTurkishUpperCase(searchTerm)
    const country = (
      form?.querySelector("#filter_properties_country") as HTMLSelectElement
    )?.selectedOptions[0]?.innerHTML
    const state = (
      form?.querySelector("#filter_properties_state") as HTMLSelectElement
    )?.selectedOptions[0]?.innerHTML
    const city = (
      form?.querySelector("#filter_properties_city") as HTMLSelectElement
    )?.selectedOptions[0]?.innerHTML
    const forSaleRent = (
      form?.querySelector(
        "#filter_properties_for_sale_rent"
      ) as HTMLSelectElement
    )?.selectedOptions[0]?.value
    const type = (
      form?.querySelector("#filter_properties_type") as HTMLSelectElement
    )?.selectedOptions[0]?.value
    const room = (
      form?.querySelector("#filter_properties_room") as HTMLSelectElement
    )?.selectedOptions[0]?.value

    if (title) {
      params.append("baslik", title)
    }
    if (country) {
      params.append("ulke", country)
    }
    if (state) {
      params.append("il", state)
    }
    if (city) {
      params.append("ilce", city)
    }
    if (forSaleRent) {
      params.append("satilik_kiralik", forSaleRent)
    }
    if (type) {
      params.append("gayrimenkul_tipi", type)
    }
    if (room) {
      params.append("oda_sayisi", room)
    }

    const queryString = params.toString()
    if (queryString) {
      link += "?" + queryString
    }

    window.location.href = link
  }

  const fetchCountries = async () => {
    setCountries([])
    setStates([])
    setStatesDisabled(true)

    const countriesArr: Option[] = []
    const restCountries: Country[] = await getCountries()

    if (restCountries) {
      restCountries.forEach((country: Country) => {
        countriesArr.push({
          value: country.id.toString(),
          text: country.translations.tr || country.name,
        })
      })
      setCountries(countriesArr)
    }
  }

  const fetchStates = async (countryId: string) => {
    setStates([])
    setStatesDisabled(true)
    setCities([])
    setCitiesDisabled(true)

    const statesArr: Option[] = []
    const restStates: State[] = await getStatesByCountry(countryId)

    if (restStates) {
      restStates.forEach((state: State) => {
        statesArr.push({
          value: state.id.toString(),
          text: state.name,
        })
      })
      setStates(statesArr)
      setStatesDisabled(false)
    }
  }

  const fetchCities = async (stateId: string) => {
    setCities([])
    setCitiesDisabled(true)

    const citiesArr: Option[] = []
    const restCities: City[] = await getCitiesByState(stateId)

    if (restCities) {
      restCities.forEach((city: City) => {
        citiesArr.push({
          value: city.id.toString(),
          text: city.name,
        })
      })
      setCities(citiesArr)
      setCitiesDisabled(false)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates("225")
  }, [])

  useEffect(() => {
    setSearchLoading(true)

    const fetchProperties = async () => {
      if (searchTerm) {
        setSearchResult(await getPropertiesBySearchTerm(searchTerm))
      }

      setSearchLoading(false)
    }

    fetchProperties()
  }, [searchTerm])

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
      <svg
        width="27"
        height="28"
        viewBox="0 0 27 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ky-icon-search"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.9987 0.666626C10.0819 0.666834 8.19298 1.12623 6.49015 2.00635C4.78731 2.88647 3.3201 4.16171 2.21132 5.72532C1.10254 7.28893 0.384471 9.0954 0.117213 10.9935C-0.150044 12.8916 0.0412903 14.8261 0.6752 16.6351C1.30911 18.4441 2.36715 20.0749 3.76075 21.391C5.15434 22.7071 6.84294 23.6702 8.68519 24.1997C10.5274 24.7292 12.4697 24.8097 14.3495 24.4344C16.2292 24.0591 17.9917 23.2389 19.4894 22.0426L24.3894 26.9426C24.6408 27.1855 24.9776 27.3199 25.3272 27.3169C25.6768 27.3138 26.0113 27.1736 26.2585 26.9264C26.5057 26.6792 26.6459 26.3448 26.6489 25.9952C26.652 25.6456 26.5176 25.3088 26.2747 25.0573L21.3747 20.1573C22.7854 18.3918 23.6688 16.2638 23.9234 14.0183C24.1779 11.7728 23.7932 9.50111 22.8136 7.46462C21.8339 5.42813 20.2991 3.70966 18.3858 2.50702C16.4726 1.30437 14.2586 0.666431 11.9987 0.666626ZM3.9987 12.6666C3.9987 11.6161 4.20563 10.5758 4.60767 9.60516C5.0097 8.63455 5.59898 7.75264 6.34185 7.00977C7.08472 6.2669 7.96663 5.67763 8.93723 5.27559C9.90784 4.87355 10.9481 4.66663 11.9987 4.66663C13.0493 4.66663 14.0896 4.87355 15.0602 5.27559C16.0308 5.67763 16.9127 6.2669 17.6556 7.00977C18.3984 7.75264 18.9877 8.63455 19.3897 9.60516C19.7918 10.5758 19.9987 11.6161 19.9987 12.6666C19.9987 14.7884 19.1558 16.8232 17.6556 18.3235C16.1553 19.8238 14.1204 20.6666 11.9987 20.6666C9.87697 20.6666 7.84214 19.8238 6.34185 18.3235C4.84156 16.8232 3.9987 14.7884 3.9987 12.6666Z"
          fill="#8c8c8c"
        />
      </svg>

      <button
        type="button"
        id="KYHeroSearchFilter"
        onClick={() => setFilterListActive(!filterListActive)}
      >
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ky-icon-gear"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.87587 1.27538C6.87583 1.03945 6.95587 0.810496 7.10291 0.625992C7.24995 0.441488 7.45526 0.312362 7.68524 0.259751C9.20922 -0.0872855 10.7918 -0.0865733 12.3155 0.261834C12.5456 0.314241 12.7512 0.443279 12.8984 0.627803C13.0457 0.812326 13.1259 1.04139 13.1259 1.27746V3.20142C13.1259 3.38427 13.174 3.56389 13.2654 3.72224C13.3569 3.88059 13.4884 4.01209 13.6467 4.10351C13.8051 4.19493 13.9847 4.24306 14.1675 4.24306C14.3504 4.24306 14.53 4.19493 14.6884 4.1035L16.3561 3.13996C16.5607 3.02186 16.7993 2.97681 17.0329 3.01221C17.2665 3.0476 17.4811 3.16134 17.6415 3.33475C18.7017 4.48182 19.4921 5.85131 19.955 7.34309C20.025 7.56869 20.0161 7.81136 19.93 8.03129C19.8439 8.25123 19.6856 8.43537 19.4811 8.5535L17.8134 9.516C17.655 9.60743 17.5235 9.73893 17.4321 9.89727C17.3407 10.0556 17.2926 10.2352 17.2926 10.4181C17.2926 10.6009 17.3407 10.7805 17.4321 10.9389C17.5235 11.0972 17.655 11.2287 17.8134 11.3202L19.48 12.2816C19.6843 12.3997 19.8425 12.5837 19.9286 12.8034C20.0147 13.0231 20.0237 13.2655 19.954 13.491C19.4942 14.9849 18.7038 16.3559 17.6415 17.5025C17.4809 17.6757 17.2663 17.7892 17.0327 17.8244C16.7992 17.8597 16.5606 17.8144 16.3561 17.6962L14.6884 16.7327C14.53 16.6412 14.3504 16.5931 14.1675 16.5931C13.9847 16.5931 13.8051 16.6412 13.6467 16.7327C13.4884 16.8241 13.3569 16.9556 13.2654 17.1139C13.174 17.2723 13.1259 17.4519 13.1259 17.6348V19.5618C13.1256 19.7977 13.0453 20.0265 12.8981 20.2109C12.7509 20.3952 12.5455 20.5241 12.3155 20.5764C10.7915 20.9234 9.20891 20.9227 7.68524 20.5743C7.45526 20.5217 7.24995 20.3926 7.10291 20.2081C6.95587 20.0236 6.87583 19.7946 6.87587 19.5587V17.6348C6.87586 17.4519 6.82773 17.2723 6.7363 17.1139C6.64487 16.9556 6.51338 16.8241 6.35502 16.7327C6.19667 16.6412 6.01704 16.5931 5.8342 16.5931C5.65135 16.5931 5.47172 16.6412 5.31337 16.7327L3.64566 17.6962C3.44107 17.8143 3.2024 17.8594 2.96883 17.824C2.73526 17.7886 2.52066 17.6748 2.36024 17.5014C1.83175 16.9298 1.36881 16.3009 0.980035 15.6264C0.590389 14.9523 0.277333 14.2368 0.0467021 13.4931C-0.0232278 13.2675 -0.0144102 13.0248 0.0717085 12.8049C0.157827 12.5849 0.316134 12.4008 0.52066 12.2827L2.18733 11.3202C2.34567 11.2287 2.47715 11.0972 2.56857 10.9389C2.65999 10.7805 2.70812 10.6009 2.70812 10.4181C2.70812 10.2352 2.65999 10.0556 2.56857 9.89727C2.47715 9.73893 2.34567 9.60743 2.18733 9.516L0.522744 8.55454C0.318249 8.43661 0.159876 8.25272 0.0735764 8.03299C-0.0127235 7.81327 -0.021832 7.57075 0.0477437 7.34517C0.507679 5.85169 1.29807 4.48097 2.36024 3.33475C2.5206 3.16158 2.73501 3.04801 2.96835 3.01262C3.20169 2.97723 3.44013 3.02213 3.64462 3.13996L5.31337 4.1035C5.47172 4.19493 5.65135 4.24306 5.8342 4.24306C6.01704 4.24306 6.19667 4.19493 6.35502 4.10351C6.51338 4.01209 6.64487 3.88059 6.7363 3.72224C6.82773 3.56389 6.87586 3.38427 6.87587 3.20142V1.27538ZM10.0009 13.5431C10.8297 13.5431 11.6245 13.2138 12.2106 12.6278C12.7966 12.0417 13.1259 11.2469 13.1259 10.4181C13.1259 9.58928 12.7966 8.79443 12.2106 8.20838C11.6245 7.62232 10.8297 7.29308 10.0009 7.29308C9.17207 7.29308 8.37721 7.62232 7.79116 8.20838C7.20511 8.79443 6.87587 9.58928 6.87587 10.4181C6.87587 11.2469 7.20511 12.0417 7.79116 12.6278C8.37721 13.2138 9.17207 13.5431 10.0009 13.5431Z"
            fill="#8c8c8c"
          />
        </svg>
      </button>

      <button type="submit" id="KYHeroSearchButton">
        <span>Ara</span>
      </button>

      <div
        className={`ky-hero-search-filter-list${
          filterListActive ? " active" : ""
        }`}
      >
        {countries.length > 0 && (
          <div className="row">
            <div className="col">
              <KYSelect
                id="filter_properties_country"
                defaultValue="225"
                options={countries}
                onChange={(e) => fetchStates(e.target.value)}
                placeholder="Ülke"
              />
            </div>
            <div className="col">
              <KYSelect
                id="filter_properties_state"
                options={states}
                onChange={(e) => fetchCities(e.target.value)}
                placeholder="Şehir"
                disabled={statesDisabled}
              />
            </div>
            <div className="col">
              <KYSelect
                id="filter_properties_city"
                options={cities}
                placeholder="İlçe"
                disabled={citiesDisabled}
              />
            </div>
          </div>
        )}

        <div className="row">
          <div className="col">
            <KYSelect
              id="filter_properties_for_sale_rent"
              options={filterForOptions}
              placeholder="Satılık/Kiralık"
            />
          </div>
          <div className="col">
            <KYSelect
              id="filter_properties_type"
              options={filterTypeOptions}
              placeholder="Gayrimenkul Tipi"
            />
          </div>
          <div className="col">
            <KYSelect
              id="filter_properties_room"
              options={filterRoomOptions}
              placeholder="Oda Sayısı"
            />
          </div>
        </div>
      </div>

      <ul
        className={`ky-hero-search-list${
          isFocused && hasValue ? " active" : ""
        }`}
      >
        {searchLoading ? (
          <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-10 w-100">
            <span className="spinner-border spinner-border-lg"></span>
          </div>
        ) : searchResult.length ? (
          searchResult.map((property) => (
            <li className="ky-hero-search-item" key={property.id}>
              <a href={`/ilan-detayi/${property.id}/`}>
                <img
                  className="ky-hero-search-item-image"
                  src={property.propertyDetails.photoURLs[0]}
                />
                <div className="ky-hero-search-item-content">
                  <div className="ky-hero-search-item-title">
                    {property.title}
                  </div>
                  {property.propertyDetails.address.label && (
                    <span className="ky-hero-search-item-desc">
                      {property.propertyDetails.address.label}
                    </span>
                  )}
                </div>
              </a>
            </li>
          ))
        ) : (
          <div className="ky-hero-search-not-found">
            Aramanızla eşleşen bir ilan bulunamadı.
          </div>
        )}
      </ul>
    </form>
  )
}

export { KYHeroSearchInput }

const filterForOptions = [
  { value: "sale", text: "Satılık" },
  { value: "rent", text: "Kiralık" },
  { value: "lease-sale", text: "Devren Satılık" },
  { value: "lease-rent", text: "Devren Kiralık" },
]

const filterTypeOptions = [
  { value: "residence", text: "Konut" },
  { value: "land", text: "Arsa" },
  { value: "office", text: "İş Yeri" },
  { value: "project", text: "Proje" },
]

const filterRoomOptions = [
  { value: "1+1", text: "1+1" },
  { value: "1.5+1", text: "1.5+1" },
  { value: "2+0", text: "2+0" },
  { value: "2+1", text: "2+1" },
  { value: "2.5+1", text: "2.5+1" },
  { value: "2+2", text: "2+2" },
  { value: "3+0", text: "3+0" },
  { value: "3+1", text: "3+1" },
  { value: "3.5+1", text: "3.5+1" },
  { value: "3+2", text: "3+2" },
  { value: "3+3", text: "3+3" },
  { value: "4+0", text: "4+0" },
  { value: "4+1", text: "4+1" },
  { value: "4.5+1", text: "4.5+1" },
  { value: "4.5+2", text: "4.5+2" },
  { value: "4+2", text: "4+2" },
  { value: "4+3", text: "4+3" },
  { value: "4+4", text: "4+4" },
  { value: "5+1", text: "5+1" },
  { value: "5.5+1", text: "5.5+1" },
  { value: "5+2", text: "5+2" },
  { value: "5+3", text: "5+3" },
  { value: "5+4", text: "5+4" },
  { value: "6+1", text: "6+1" },
  { value: "6+2", text: "6+2" },
  { value: "6.5+1", text: "6.5+1" },
  { value: "6+3", text: "6+3" },
  { value: "6+4", text: "6+4" },
  { value: "7+1", text: "7+1" },
  { value: "7+2", text: "7+2" },
  { value: "7+3", text: "7+3" },
  { value: "8+1", text: "8+1" },
  { value: "8+2", text: "8+2" },
  { value: "8+3", text: "8+3" },
  { value: "8+4", text: "8+4" },
  { value: "9+1", text: "9+1" },
  { value: "9+2", text: "9+2" },
  { value: "9+3", text: "9+3" },
  { value: "9+4", text: "9+4" },
  { value: "9+5", text: "9+5" },
  { value: "9+6", text: "9+6" },
  { value: "10+1", text: "10+1" },
  { value: "10+2", text: "10+2" },
  { value: "10++", text: "10++" },
]
