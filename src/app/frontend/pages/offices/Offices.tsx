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

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchCountries = () => {
    try {
      const countriesData = getCountries()
      const countriesArr = countriesData.map((country) => ({
        value: country.id.toString(),
        text: country.translations.tr || "",
      }))
      setCountries(countriesArr)
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  const fetchStates = (countryId: number) => {
    if (countryId) {
      try {
        const statesData = getStatesByCountry(countryId)

        if (statesData) {
          const statesArr = statesData.map((state) => ({
            value: state.id.toString(),
            text: state.name || "",
          }))

          setStatesDisabled(false)
          setStates(statesArr)

          setCities([])
        } else {
          console.log("Şehir bulunamadı")
        }
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    } else {
      setStates([])
      setStatesDisabled(true)

      setCities([])
      setCitiesDisabled(true)
    }
  }

  const fetchCities = (stateId: number) => {
    if (stateId) {
      try {
        const citiesData = getCitiesByState(stateId)

        if (citiesData) {
          const citiesArr = citiesData.map((state) => ({
            value: state.id.toString(),
            text: state.name || "",
          }))

          setCitiesDisabled(false)
          setCities(citiesArr)
        } else {
          console.log("İlçe bulunamadı")
        }
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    } else {
      setCities([])
      setCitiesDisabled(true)
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
    fetchStates(225)
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
                    defaultValue="225"
                    options={countries}
                    onChange={(e) => fetchStates(parseInt(e.target.value))}
                    placeholder="Ülke"
                  />
                  <KYSelect
                    id="sell_rent_state"
                    options={states}
                    onChange={(e) => fetchCities(parseInt(e.target.value))}
                    placeholder="Şehir"
                    disabled={statesDisabled}
                  />
                  <KYSelect
                    id="sell_rent_city"
                    options={cities}
                    required
                    placeholder="İlçe"
                    disabled={citiesDisabled}
                  />
                  <KYButton type="submit" text="Ara" secondary />
                </div>
              </div>
            </form>
          </motion.div>

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
