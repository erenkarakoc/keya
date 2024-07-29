import "./Offices.css"
import React, { useState, useEffect } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"
import { KYOfficeCard } from "./components/KYOfficeCard/KYOfficeCard"
import { KYPagination } from "../../components/KYPagination/KYPagination"

import { Office } from "../../../modules/apps/office-management/_core/_models"
import { getAllOffices } from "../../../modules/apps/office-management/_core/_requests"

import { motion } from "framer-motion"
import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
} from "../../../../_metronic/helpers/kyHelpers"

import {
  City,
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"

interface Option {
  value: string
  text: string
}

const PAGE_SIZE = 8

const Offices = () => {
  const [offices, setOffices] = useState<Office[]>([])
  const [filteredOffices, setFilteredOffices] = useState<Office[]>([])
  const [officesLoading, setOfficesLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])

  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.currentTarget
    const name = (
      form.querySelector("#filter_offices_office_name") as HTMLInputElement
    )?.value
      .toLowerCase()
      .replace(import.meta.env.VITE_APP_NAME.toLowerCase(), "")
      .trim()
    const country = (
      form.querySelector("#filter_offices_country") as HTMLSelectElement
    )?.value
    const state = (
      form.querySelector("#filter_offices_state") as HTMLSelectElement
    )?.value
    const city = (
      form.querySelector("#filter_offices_city") as HTMLSelectElement
    )?.value

    const filtered = offices.filter((office) => {
      const matchesName = name ? office.name.toLowerCase().includes(name) : true

      const matchesCountry = country
        ? office.address?.country?.split("|")[1]?.toString() === country
        : true
      const matchesState = state
        ? office.address?.state?.split("|")[1]?.toString() === state
        : true
      const matchesCity = city
        ? office.address?.city?.split("|")[1]?.toString() === city
        : true

      return matchesName && matchesCountry && matchesState && matchesCity
    })

    setFilteredOffices(filtered)
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE))
    setCurrentPage(1)
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

  const fetchOffices = async () => {
    try {
      const offices = await getAllOffices()

      offices.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })

      setOffices(offices)
      setFilteredOffices(offices)
      setOfficesLoading(false)

      const totalOffices = offices.length
      setTotalPages(Math.ceil(totalOffices / PAGE_SIZE))
    } catch (error) {
      setOfficesLoading(false)
      console.error("Error fetching agents and brokers:", error)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates("225")
    fetchOffices()
  }, [])

  const renderOffices = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE

    return filteredOffices.length ? (
      filteredOffices.slice(startIndex, endIndex).map((office, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + idx * 0.1 }}
          className="col-lg-3 mt-6 mt-lg-0"
          key={office.id}
        >
          <KYOfficeCard office={office} />
        </motion.div>
      ))
    ) : (
      <div className="ky-card p-10 text-center">
        <span className="ky-text ky-caption">
          Bu filtrelere uygun bir ofis bulunamadı.
        </span>
      </div>
    )
  }

  return (
    <div className="ky-page-agents">
      <KYPageHeader
        title="Ofislerimiz"
        subtitle="Türkiye’nin ve dünyanın dört bir yanındaki ofislerimize göz atın. Bizimle iletişime geçin ve size en yakın ofisimizde sizi ağırlayalım."
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
            <form
              onSubmit={handleFilterSubmit}
              className="ky-agents-search ky-card ky-form"
            >
              <div className="ky-card-header">Ofis Ara</div>
              <div className="ky-card-content">
                <div className="ky-form-group">
                  <KYInput
                    id="filter_offices_office_name"
                    type="text"
                    placeholder="Ofis Adı"
                  />

                  <div className="ky-seperator my-5"></div>

                  {countries.length > 0 && (
                    <>
                      <KYSelect
                        id="filter_offices_country"
                        defaultValue="225"
                        options={countries}
                        onChange={(e) => fetchStates(e.target.value)}
                        placeholder="Ülke"
                      />
                      <KYSelect
                        id="filter_offices_state"
                        options={states}
                        onChange={(e) => fetchCities(e.target.value)}
                        placeholder="Şehir"
                        disabled={statesDisabled}
                      />
                      <KYSelect
                        id="filter_offices_city"
                        options={cities}
                        placeholder="İlçe"
                        disabled={citiesDisabled}
                      />
                    </>
                  )}
                  <div className="ky-button ky-button-secondary">
                    <button type="submit">Ara</button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          <div className="col-lg-8">
            <div className="row ky-offices-list">
              {officesLoading ? "" : renderOffices()}
            </div>
            {!officesLoading && (
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

export { Offices }
