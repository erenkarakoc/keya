import "./Offices.css"
import React, { useState, useEffect } from "react"
import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"
import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
} from "../../../../_metronic/helpers/kyHelpers"
import { KYButton } from "../../components/KYButton/KYButton"
import { KYOfficeCard } from "./components/KYOfficeCard/KYOfficeCard"
import { Office } from "../../../modules/apps/office-management/_core/_models"
import { motion } from "framer-motion"
import { KYPagination } from "../../components/KYPagination/KYPagination"
import { getAllOffices } from "../../../modules/apps/office-management/_core/_requests"

import {
  Country,
  State,
  City,
} from "../../../../_metronic/helpers/address-helper/_models"

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
  const [selectedState, setSelectedState] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchCountries = async () => {
    try {
      const countriesArr: Option[] = []
      const restCountries: Country[] | undefined = await getCountries("TR")

      if (restCountries) {
        restCountries.forEach((country: Country) => {
          countriesArr.push({ value: country.id, text: country.name })
        })

        setCountries(countriesArr)
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  const fetchStates = async (countryCode: string) => {
    try {
      setStatesDisabled(true)
      setCitiesDisabled(true)
      setStates([])
      setCities([])

      if (countryCode) {
        const statesArr: Option[] = []
        const restStates: State[] | undefined = await getStatesByCountry(
          countryCode
        )

        if (restStates) {
          restStates.forEach((state: State) => {
            statesArr.push({ value: state.id.toString(), text: state.name })
          })

          setStates(statesArr)
          setStatesDisabled(false)
        }
      }
    } catch (error) {
      console.error("Error fetching states:", error)
      setStates([])

      setCitiesDisabled(true)
      setCities([])
    }
  }

  const fetchCities = async (stateName: string, countryCode: string) => {
    try {
      setCitiesDisabled(true)
      setCities([])

      if (stateName && countryCode) {
        const citiesArr: Option[] = []
        const restCities: City[] | undefined = await getCitiesByState(
          stateName,
          countryCode
        )

        if (restCities) {
          restCities.forEach((city: City) => {
            citiesArr.push({ value: city.id, text: city.name })
          })

          setCities(citiesArr)
          setCitiesDisabled(false)
        }
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
      setCities([])
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
    // fetchOffices()
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
          {countries && countries.length ? (
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
                    {!statesDisabled ? (
                      <KYSelect
                        id="sell_rent_state"
                        options={states}
                        onChange={(e) => {
                          fetchCities(selectedCountry, e.target.value)
                          setSelectedState(e.target.value)
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
