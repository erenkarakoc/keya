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

interface Option {
  value: string
  text: string
}

const PAGE_SIZE = 12

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [propertiesLoaded, setPropertiesLoaded] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])

  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const fetchCountries = async () => {
    setCountries([])
    setStates([])
    setStatesDisabled(true)

    const countriesArr: { value: string; text: string }[] = []
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

    const statesArr: { value: string; text: string }[] = []
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

    const citiesArr: { value: string; text: string }[] = []
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
      setPropertiesLoaded(true)

      const totalOffices = properties.length
      setTotalPages(Math.ceil(totalOffices / PAGE_SIZE))
    } catch (error) {
      setPropertiesLoaded(false)
      console.error("Error fetching properties:", error)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates("225")
    fetchProperties()
  }, [])

  const renderOffices = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return properties.slice(startIndex, endIndex).map((property, idx) => (
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
  }

  return (
    <div className="ky-page-agents">
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
            <form className="ky-offices-search ky-card ky-form">
              <div className="ky-card-header">İlan Ara</div>
              <div className="ky-card-content">
                <div className="ky-form-group">
                  <KYInput
                    id="search_office_name"
                    type="text"
                    placeholder="İlan Adı"
                  />

                  {countries && countries?.length ? (
                    <>
                      <KYSelect
                        id="sell_rent_country"
                        defaultValue="225"
                        options={countries}
                        onChange={(e) => {
                          fetchStates(e.target.value)
                        }}
                        placeholder="Ülke"
                      />
                      {!statesDisabled && states?.length ? (
                        <KYSelect
                          id="sell_rent_state"
                          options={states}
                          onChange={(e) => {
                            fetchCities(e.target.value)
                          }}
                          placeholder="Şehir"
                          disabled={statesDisabled}
                        />
                      ) : (
                        ""
                      )}
                      {!citiesDisabled && cities?.length ? (
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
                    </>
                  ) : (
                    ""
                  )}

                  <KYButton type="submit" text="Ara" secondary />
                </div>
              </div>
            </form>
          </motion.div>

          <div className="col-lg-8">
            <div className="row ky-offices-list">{renderOffices()}</div>
            {propertiesLoaded && (
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
