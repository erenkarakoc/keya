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
import { KYAgentCard } from "./components/KYAgentCard/KYAgentCard"
import { User } from "../../../modules/apps/user-management//_core/_models"
import { getAllUsers } from "../../../modules/apps/user-management//_core/_requests"
import { motion } from "framer-motion"
import { KYPagination } from "../../components/KYPagination/KYPagination"
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

const Agents = () => {
  const [offices, setOffices] = useState<Option[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)

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
      form.querySelector("#filter_agents_agent_name") as HTMLInputElement
    )?.value.toLowerCase()
    const office = (
      form.querySelector("#filter_agents_office_name") as HTMLSelectElement
    )?.value
    const country = (
      form.querySelector("#filter_agents_country") as HTMLSelectElement
    )?.value
    const state = (
      form.querySelector("#filter_agents_state") as HTMLSelectElement
    )?.value
    const city = (
      form.querySelector("#filter_agents_city") as HTMLSelectElement
    )?.value

    const filtered = users.filter((user) => {
      const matchesName = name
        ? user.firstName.toLowerCase().includes(name) ||
          user.lastName.toLowerCase().includes(name)
        : true
      const matchesOffice = office ? user.officeId === office : true

      const matchesCountry = country
        ? user.address?.country?.split("|")[1]?.toString() === country
        : true
      const matchesState = state
        ? user.address?.state?.split("|")[1]?.toString() === state
        : true
      const matchesCity = city
        ? user.address?.city?.split("|")[1]?.toString() === city
        : true

      return (
        matchesOffice &&
        matchesName &&
        matchesCountry &&
        matchesState &&
        matchesCity
      )
    })

    setFilteredUsers(filtered)
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE))
    setCurrentPage(1)
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

  const fetchAgentsAndBrokers = async () => {
    try {
      const usersArr = await getAllUsers()

      usersArr.sort((a, b) => a.firstName.localeCompare(b.firstName))

      setUsers(usersArr)
      setFilteredUsers(usersArr)
      setTotalPages(Math.ceil(usersArr.length / PAGE_SIZE))
      setUsersLoading(false)
    } catch (error) {
      setUsers([])
      console.error("Error fetching agents and brokers:", error)
    }
  }

  useEffect(() => {
    fetchAgentsAndBrokers()
    fetchOffices()
    fetchCountries()
    fetchStates("225")
  }, [])

  const renderUsers = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE

    return filteredUsers.length ? (
      filteredUsers
        .sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") return -1
          if (a.role !== "admin" && b.role === "admin") return 1
          return 0
        })
        .slice(startIndex, endIndex)
        .map((user, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="col-lg-3 mt-6 mt-lg-0"
            key={user.id}
          >
            <KYAgentCard user={user} />
          </motion.div>
        ))
    ) : (
      <div className="ky-card p-10 text-center">
        <span className="ky-text ky-caption">
          Bu filtrelere uygun bir danışman bulunamadı.
        </span>
      </div>
    )
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
            <form
              onSubmit={handleFilterSubmit}
              className="ky-agents-search ky-card ky-form"
            >
              <div className="ky-card-header">Danışman Ara</div>
              <div className="ky-card-content">
                <div className="ky-form-group">
                  <KYInput
                    id="filter_agents_agent_name"
                    type="text"
                    placeholder="Danışman Adı"
                  />

                  <div className="ky-seperator my-5"></div>

                  <KYSelect
                    id="filter_agents_office_name"
                    options={offices}
                    placeholder="Ofis Adı"
                  />

                  <div className="ky-seperator my-5"></div>

                  {countries.length > 0 && (
                    <>
                      <KYSelect
                        id="filter_agents_country"
                        defaultValue="225"
                        options={countries}
                        onChange={(e) => fetchStates(e.target.value)}
                        placeholder="Ülke"
                      />
                      <KYSelect
                        id="filter_agents_state"
                        options={states}
                        onChange={(e) => fetchCities(e.target.value)}
                        placeholder="Şehir"
                        disabled={statesDisabled}
                      />
                      <KYSelect
                        id="filter_agents_city"
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
            <div className="row ky-agents-list">
              {usersLoading ? "" : renderUsers()}
            </div>

            {!usersLoading && totalPages > 1 && (
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
