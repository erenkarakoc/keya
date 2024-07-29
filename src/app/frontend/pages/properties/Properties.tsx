import "./Properties.css"

import { useLocation } from "react-router-dom"
import React, { useState, useEffect } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"
import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  toTurkishUpperCase,
} from "../../../../_metronic/helpers/kyHelpers"
import { motion } from "framer-motion"
import { KYPagination } from "../../components/KYPagination/KYPagination"
import { Property } from "../../../modules/apps/property-management/_core/_models"
import { getAllProperties } from "../../../modules/apps/property-management/_core/_requests"
import { KYPropertyCard } from "./components/KYPropertyCard/KYPropertyCard"
import {
  City,
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"
import { getAllOffices } from "../../../modules/apps/office-management/_core/_requests"

interface Option {
  value: string
  text: string
}

const PAGE_SIZE = 16

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [propertiesLoading, setPropertiesLoading] = useState(true)

  const [offices, setOffices] = useState<Option[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])
  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const location = useLocation()

  const handleFilterSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()

    const form = e?.currentTarget || document.querySelector("form.ky-form")
    const title = toTurkishUpperCase(
      (form?.querySelector("#filter_properties_title") as HTMLInputElement)
        ?.value
    )
    const office = (
      form?.querySelector("#filter_properties_office_name") as HTMLSelectElement
    )?.value
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

    const filtered = properties.filter((property) => {
      const matchesName = title
        ? toTurkishUpperCase(property.title).includes(title)
        : true
      const matchesOffice = office ? property.officeId === office : true
      const matchesCountry = country
        ? property.propertyDetails.address.label.includes(country)
        : true
      const matchesState = state
        ? property.propertyDetails.address.label.includes(state)
        : true
      const matchesCity = city
        ? property.propertyDetails.address.label.includes(city)
        : true
      const matchesForSaleRent = forSaleRent
        ? property.propertyDetails.for === forSaleRent
        : true
      const matchesType = type ? property.propertyDetails.type === type : true
      const matchesRoom = room ? property.propertyDetails.room === room : true

      return (
        matchesOffice &&
        matchesName &&
        matchesCountry &&
        matchesState &&
        matchesCity &&
        matchesForSaleRent &&
        matchesType &&
        matchesRoom
      )
    })

    setFilteredProperties(filtered)
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE))
    setCurrentPage(1)
    document.querySelector(".ky-layout")?.scrollTo(0, 0)
  }

  const checkQueryParams = () => {
    const query = new URLSearchParams(location.search)
    const titleParamValue = query.get("baslik")
    const countryParamValue = query.get("ulke")
    const stateParamValue = query.get("il")
    const cityParamValue = query.get("ilce")
    const forSaleRentParamValue = query.get("satilik_kiralik")
    const typeParamValue = query.get("gayrimenkul_tipi")
    const roomParamValue = query.get("oda_sayisi")

    const form = document.querySelector("form.ky-form")

    if (form) {
      const titleSelect = form.querySelector(
        "#filter_properties_title"
      ) as HTMLSelectElement
      const countrySelect = form.querySelector(
        "#filter_properties_country"
      ) as HTMLSelectElement
      const stateSelect = form.querySelector(
        "#filter_properties_state"
      ) as HTMLSelectElement
      const citySelect = form.querySelector(
        "#filter_properties_city"
      ) as HTMLSelectElement
      const forSaleRentSelect = form.querySelector(
        "#filter_properties_for_sale_rent"
      ) as HTMLSelectElement
      const typeSelect = form.querySelector(
        "#filter_properties_type"
      ) as HTMLSelectElement
      const roomSelect = form.querySelector(
        "#filter_properties_room"
      ) as HTMLSelectElement

      if (titleSelect && titleParamValue) titleSelect.value = titleParamValue
      if (countrySelect && countryParamValue)
        countrySelect.value = countryParamValue
      if (stateSelect && stateParamValue) stateSelect.value = stateParamValue
      if (citySelect && cityParamValue) citySelect.value = cityParamValue
      if (forSaleRentSelect && forSaleRentParamValue)
        forSaleRentSelect.value = forSaleRentParamValue
      if (typeSelect && typeParamValue) typeSelect.value = typeParamValue
      if (roomSelect && roomParamValue) roomSelect.value = roomParamValue
    }

    handleFilterSubmit()
  }

  const fetchOffices = async () => {
    const officesArr: Option[] = []
    const restOffices: Office[] = await getAllOffices()

    if (restOffices) {
      restOffices.forEach((office: Office) => {
        officesArr.push({
          value: office.id.toString(),
          text: `${import.meta.env.VITE_APP_NAME} ${office.name}`,
        })
      })
      setOffices(officesArr)
    }
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

  const fetchProperties = async () => {
    try {
      const properties = await getAllProperties()

      properties.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1
        if (a.createdAt > b.createdAt) return 1
        return 0
      })

      setProperties(properties)
      setPropertiesLoading(false)

      const totalProperties = properties.length
      setTotalPages(Math.ceil(totalProperties / PAGE_SIZE))
    } catch (error) {
      setPropertiesLoading(false)
      console.error("Error fetching properties:", error)
    }
  }

  useEffect(() => {
    fetchOffices()
    fetchCountries()
    fetchStates("225")
    fetchProperties()
  }, [])

  useEffect(() => {
    checkQueryParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties])

  const renderProperties = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE

    return filteredProperties.length ? (
      filteredProperties.slice(startIndex, endIndex).map((property, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + idx * 0.1 }}
          className="col-lg-3"
          key={property.id}
        >
          <KYPropertyCard property={property} />
        </motion.div>
      ))
    ) : (
      <div className="ky-card p-10 text-center">
        <span className="ky-text ky-caption">
          Bu filtrelere uygun bir ilan bulunamadı.
        </span>
      </div>
    )
  }

  return (
    <div className="ky-page-properties">
      <KYPageHeader
        title="İlanlarımız"
        subtitle="Türkiye’nin ve dünyanın dört bir yanındaki ilanlarımıza göz atın. Bizimle iletişime geçin ve size en uygun ilanı bulalım."
      />

      <div className="ky-page-content">
        <div className="row">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-lg-3"
          >
            <form onSubmit={handleFilterSubmit} className="ky-card ky-form">
              <div className="ky-card-header">İlan Ara</div>
              <div className="ky-card-content">
                <div className="ky-form-group">
                  <KYInput
                    id="filter_properties_title"
                    type="text"
                    placeholder="Anahtar Kelime"
                  />

                  <div className="ky-seperator my-5"></div>

                  <KYSelect
                    id="filter_properties_office_name"
                    options={offices}
                    placeholder="Ofis Adı"
                  />

                  <div className="ky-seperator my-5"></div>

                  {countries.length > 0 && (
                    <>
                      <KYSelect
                        id="filter_properties_country"
                        defaultValue="225"
                        options={countries}
                        onChange={(e) => fetchStates(e.target.value)}
                        placeholder="Ülke"
                      />
                      <KYSelect
                        id="filter_properties_state"
                        options={states}
                        onChange={(e) => fetchCities(e.target.value)}
                        placeholder="Şehir"
                        disabled={statesDisabled}
                      />
                      <KYSelect
                        id="filter_properties_city"
                        options={cities}
                        placeholder="İlçe"
                        disabled={citiesDisabled}
                      />
                    </>
                  )}

                  <div className="ky-seperator my-5"></div>

                  <KYSelect
                    id="filter_properties_for_sale_rent"
                    options={filterForOptions}
                    placeholder="Satılık/Kiralık"
                  />
                  <KYSelect
                    id="filter_properties_type"
                    options={filterTypeOptions}
                    placeholder="Gayrimenkul Tipi"
                  />
                  <KYSelect
                    id="filter_properties_room"
                    options={filterRoomOptions}
                    placeholder="Oda Sayısı"
                  />

                  <div className="ky-button ky-button-secondary">
                    <button type="submit">Ara</button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          <div className="col-lg-8">
            <div className="row ky-offices-list">
              {propertiesLoading ? "" : renderProperties()}
            </div>

            {!propertiesLoading && totalPages > 1 && (
              <KYPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Properties }

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
