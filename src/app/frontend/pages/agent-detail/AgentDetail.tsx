import "./AgentDetail.css"
import React, { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { User } from "../../../modules/apps/user-management/_core/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"

import { getUserById } from "../../../modules/apps/user-management/_core/_requests"
import { getOfficeById } from "../../../modules/apps/office-management/_core/_requests"

import { KTIcon } from "../../../../_metronic/helpers"
import {
  getCityById,
  getCountryById,
  getStateById,
  slugify,
} from "../../../../_metronic/helpers/kyHelpers"
import { AgentPropertiesList } from "./components/AgentPropertiesList"
import { AgentCommentsList } from "./components/AgentCommentsList"
import { KYText } from "../../components/KYText/KYText"

const AgentDetail = () => {
  const { id } = useParams()
  const [user, setUser] = useState<User>()
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [office, setOffice] = useState<Office>()
  const [officeAddress, setOfficeAddress] = useState("")

  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(false)
      const resUser = await getUserById(id)

      if (resUser) {
        setUser(resUser)
      }

      console.log(isUserLoading)
    }

    fetchUser()
  }, [id])

  useEffect(() => {
    const fetchOffice = async () => {
      if (user?.officeId) {
        setOffice(await getOfficeById(user.officeId))
      }
    }

    fetchOffice()
  }, [user])

  useEffect(() => {
    const fetchAddress = async () => {
      let country = ""
      let state = ""
      let city = ""

      if (office) {
        if (office.address?.country) {
          const countryData = await getCountryById(office.address.country)
          country = countryData ? countryData.translations.tr : ""
        }
        if (office.address?.state) {
          const stateData = await getStateById(office.address.state)
          state = stateData ? stateData.name : ""
        }
        if (office.address?.city) {
          const cityData = await getCityById(office.address.city)
          city = cityData ? cityData.name : ""
        }

        const addressString = `${city ? city + ", " : ""}${
          state ? state + ", " : ""
        }${country ? country : ""}`

        setOfficeAddress(
          office.address?.addressLine
            ? office.address?.addressLine + ", " + addressString
            : addressString
        )
      }
    }

    fetchAddress()
  }, [office])

  return (
    <div className="ky-page-agent-detail">
      <div className="ky-page-content">
        <div className="ky-card">
          {isUserLoading ? (
            user ? (
              <div className="row">
                <div className="col-lg-2">
                  <div className="ky-agent-detail-image">
                    <img
                      src={user.photoURL ?? ""}
                      alt={user.firstName + " " + user.lastName}
                    />
                  </div>

                  <div className="ky-agent-name">
                    {user.firstName + " " + user.lastName}
                  </div>

                  {office && (
                    <a
                      href={`/ofis-detayi/${office.id}/`}
                      target="_blank"
                      className="ky-agent-office-name"
                    >
                      {import.meta.env.VITE_APP_NAME} {office.name}
                    </a>
                  )}

                  <div className="separator my-10"></div>

                  {officeAddress && (
                    <a
                      href={`https://maps.google.com/?q=${officeAddress}`}
                      target="_blank"
                      className="ky-agent-row"
                    >
                      <div className="d-flex align-items-center">
                        <KTIcon
                          iconName="map"
                          iconType="solid"
                          className="fs-2 me-4"
                        />

                        <div className="d-flex flex-column">
                          <div className="ky-agent-row-title">Ofis Adresi</div>
                        </div>
                      </div>
                    </a>
                  )}

                  <a href={`mailto:${user.email}`} className="ky-agent-row">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="sms"
                        iconType="solid"
                        className="fs-2 me-4"
                      />

                      <div className="d-flex flex-column">
                        <div className="ky-agent-row-title">E-posta gönder</div>
                        <span className="ky-agent-row-label">{user.email}</span>
                      </div>
                    </div>
                  </a>

                  <a
                    href={`tel:${slugify(user.phoneNumber ?? "")}`}
                    className="ky-agent-row"
                  >
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="phone"
                        iconType="solid"
                        className="fs-2 me-4"
                      />

                      <div className="d-flex flex-column">
                        <div className="ky-agent-row-title">Telefon et</div>
                        <span className="ky-agent-row-label">
                          {user.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </a>

                  <div className="separator my-10"></div>

                  <div className="ky-button ky-button-secondary mb-4">
                    <button>
                      <KTIcon
                        iconName="message-text-2"
                        iconType="solid"
                        className="fs-2 me-2 text-white"
                      />
                      Yorum Yaz
                    </button>
                  </div>
                  <KYText variant="caption">
                    Danışmandan aldığınız hizmeti değerlendirin.
                  </KYText>
                </div>

                <div className="col-lg-10">
                  <nav className="ky-agent-tab-nav">
                    <ul>
                      <li
                        className={`${activeTab === "about" && "active"}`}
                        onClick={() => setActiveTab("about")}
                      >
                        <span>Hakkında</span>
                      </li>
                      <li
                        className={`${
                          activeTab === "properties" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("properties")}
                      >
                        <span>İlanlar</span>
                      </li>
                      <li
                        className={`${
                          activeTab === "comments" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("comments")}
                      >
                        <span>Yorumlar</span>
                      </li>
                    </ul>
                  </nav>

                  <div
                    className={`ky-agent-tab${
                      activeTab != "about" ? " d-none" : ""
                    }`}
                  >
                    {user.about && (
                      <>
                        <div className="ky-agent-about-title">
                          {user.about.title}
                        </div>
                        <div className="ky-agent-about-description">
                          {user.about.description}
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className={`ky-agent-tab${
                      activeTab != "properties"
                        ? " d-none"
                        : " d-flex flex-column"
                    }`}
                  >
                    <AgentPropertiesList user={user} />
                  </div>

                  <div
                    className={`ky-agent-tab${
                      activeTab != "comments" ? " d-none" : ""
                    }`}
                  >
                    <AgentCommentsList user={user} />
                  </div>
                </div>
              </div>
            ) : (
              "user not found"
            )
          ) : (
            <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
              <span className="spinner-border spinner-border-lg"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { AgentDetail }
