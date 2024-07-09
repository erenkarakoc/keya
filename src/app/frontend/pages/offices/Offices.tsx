import "./Offices.css"
import React, { useState, useEffect } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"
import { KYButton } from "../../components/KYButton/KYButton"
import { KYOfficeCard } from "./components/KYOfficeCard/KYOfficeCard"
import { KYPagination } from "../../components/KYPagination/KYPagination"

import { Office } from "../../../modules/apps/office-management/_core/_models"
import { getAllOffices } from "../../../modules/apps/office-management/_core/_requests"

import { motion } from "framer-motion"

import { City, Country, State } from "country-state-city"
interface Option {
  value: string
  text: string
}

const PAGE_SIZE = 8

const Offices = () => {
  const [offices, setOffices] = useState<Office[]>([])
  const [officesLoaded, setOfficesLoaded] = useState(false)

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])

  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const [selectedCountry, setSelectedCountry] = useState("TR")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchCountries = () => {
    setCountries([])
    const countriesArr: { value: string; text: string }[] = []
    const restCountries = Country.getAllCountries()

    if (restCountries) {
      restCountries.forEach((country) => {
        countriesArr.push({ value: country.isoCode, text: country.name })
      })
      setCountries(countriesArr)
      setStates([])
    }
  }

  const fetchStates = (countryCode: string) => {
    setStatesDisabled(true)

    const statesArr: { value: string; text: string }[] = []
    const restStates = State.getStatesOfCountry(countryCode)

    if (restStates) {
      restStates.forEach((state) => {
        statesArr.push({ value: state.isoCode, text: state.name })
      })
      setStates(statesArr)
      setStatesDisabled(false)
      setCities([])
    }
  }

  const fetchCities = async (countryCode: string, stateCode: string) => {
    const citiesArr: { value: string; text: string }[] = []
    const restCities = City.getCitiesOfState(countryCode, stateCode)

    if (restCities) {
      restCities.forEach((city) => {
        citiesArr.push({ value: city.name, text: city.name })
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
      setOfficesLoaded(true)

      const totalOffices = offices.length
      setTotalPages(Math.ceil(totalOffices / PAGE_SIZE))
    } catch (error) {
      setOfficesLoaded(false)
      console.error("Error fetching agents and brokers:", error)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates("TR")
    fetchOffices()
  }, [])

  const renderOffices = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return offices.slice(startIndex, endIndex).map((office, idx) => (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + idx * 0.1 }}
        className="col-lg-3"
        key={office.id}
      >
        <KYOfficeCard office={office} />
      </motion.div>
    ))
  }

  return (
    <div className="ky-page-agents">
      <KYPageHeader
        title="Ofislerimiz"
        subtitle="Türkiye’nin ve dünyanın dört bir yanındaki ofislerimize göz atın. Bizimle iletişime geçin ve size en yakın ofisimizde sizi ağırlayalım."
      />

      <div className="ky-page-content">
        <div className="row">
          {countries && countries?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="col-lg-3"
            >
              <form className="ky-offices-search ky-card ky-form">
                <div className="ky-card-header">Ofis Ara</div>
                <div className="ky-card-content">
                  <div className="ky-form-group">
                    <KYInput
                      id="search_office_name"
                      type="text"
                      placeholder="Ofis Adı"
                    />

                    <KYSelect
                      id="sell_rent_country"
                      defaultValue="TR"
                      options={countries}
                      onChange={(e) => {
                        fetchStates(e.target.value)
                        setSelectedCountry(e.target.value)
                      }}
                      placeholder="Ülke"
                    />
                    {!statesDisabled && states?.length ? (
                      <KYSelect
                        id="sell_rent_state"
                        options={states}
                        onChange={(e) => {
                          fetchCities(selectedCountry, e.target.value)
                        }}
                        placeholder="Şehir"
                        disabled={statesDisabled}
                      />
                    ) : (
                      ""
                    )}
                    {!citiesDisabled ? (
                      <KYSelect
                        id="sell_rent_city"
                        options={cities}
                        required
                        placeholder="İlçe"
                        disabled={citiesDisabled}
                      />
                    ) : (
                      ""
                    )}
                    <KYButton type="submit" text="Ara" secondary />
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            ""
          )}

          <div className="col-lg-8">
            <div className="row ky-offices-list">{renderOffices()}</div>
            {officesLoaded && (
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
