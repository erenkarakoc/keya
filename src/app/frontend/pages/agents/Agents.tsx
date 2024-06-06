import "./Agents.css"
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
import { KYAgentCard } from "./components/KYAgentCard/KYAgentCard"
import { User } from "../../../modules/apps/user-management/users-list/core/_models"
import { getUsersByRole } from "../../../modules/apps/user-management/users-list/core/_requests"
import { motion } from "framer-motion"
import { KYPagination } from "../../components/KYPagination/KYPagination"

interface Option {
  value: string
  text: string
}

const PAGE_SIZE = 8

const Agents = () => {
  const [users, setUsers] = useState<User[]>([])
  const [usersLoaded, setUsersLoaded] = useState(false)

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

  const fetchAgentsAndBrokers = async () => {
    try {
      const agents = await getUsersByRole("agent")
      const brokers = await getUsersByRole("broker")
      const agentsAndBrokers = [...(agents || []), ...(brokers || [])]

      agentsAndBrokers.sort((a, b) => {
        if (a.firstName < b.firstName) return -1
        if (a.firstName > b.firstName) return 1
        return 0
      })

      setUsers(agentsAndBrokers)
      setUsersLoaded(true)

      const totalUsers = agentsAndBrokers.length
      setTotalPages(Math.ceil(totalUsers / PAGE_SIZE))
    } catch (error) {
      setUsersLoaded(false)
      console.error("Error fetching agents and brokers:", error)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates(225)
    fetchAgentsAndBrokers()
  }, [])

  const renderUsers = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return users.slice(startIndex, endIndex).map((user, idx) => (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + idx * 0.1 }}
        className="col-lg-3"
        key={user.id}
      >
        <KYAgentCard user={user} />
      </motion.div>
    ))
  }

  return (
    <div className="ky-page-agents">
      <KYPageHeader
        title="Danışmanlarımız"
        subtitle="Gayrimenkul alım ve satım işlemlerinizde Keya'nın tecrübeli danışmanlarından profesyonel rehberlik alın."
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
            <form className="ky-agents-search ky-card ky-form">
              <div className="ky-card-header">Danışman Ara</div>
              <div className="ky-card-content">
                <div className="ky-form-group">
                  <KYInput
                    id="search_agent_name"
                    type="text"
                    placeholder="Danışman Adı"
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
            <div className="row ky-agents-list">{renderUsers()}</div>
            {usersLoaded && (
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

export { Agents }
