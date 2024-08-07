import "./OfficeDetail.css"
import React, { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { Office } from "../../../modules/apps/office-management/_core/_models"
import { getOfficeById } from "../../../modules/apps/office-management/_core/_requests"

import { KTIcon } from "../../../../_metronic/helpers"
import {
  getCityById,
  getCountryById,
  getStateById,
  slugify,
} from "../../../../_metronic/helpers/kyHelpers"

import { OfficePropertiesList } from "./components/OfficePropertiesList"
import { OfficeCommentsList } from "./components/OfficeCommentsList"

import { KYText } from "../../components/KYText/KYText"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper as SwiperModel } from "swiper/types"
import { OfficeUsersList } from "./components/OfficeUsersList"

const OfficeDetail = () => {
  const { id } = useParams()
  const [office, setOffice] = useState<Office>()
  const [officeAddress, setOfficeAddress] = useState("")

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperModel | null>(null)

  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    const fetchOffices = async () => {
      setOffice(await getOfficeById(id ?? ""))
    }

    fetchOffices()
  }, [id])

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
    <div className="ky-page-office-detail">
      <div className="ky-page-content">
        <div className="ky-card">
          {office ? (
            <div className="row">
              <div className="col-lg-3">
                <div className="ky-office-detail-image">
                  <Swiper
                    style={
                      {
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                      } as React.CSSProperties
                    }
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mainImages"
                  >
                    {office.photoURLs.map((url, i) => (
                      <SwiperSlide key={i}>
                        <img src={url} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={3}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbnailSwiper"
                  >
                    {office.photoURLs.map((url, i) => (
                      <SwiperSlide key={i}>
                        <img src={url} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="ky-office-name">{office.name}</div>

                {office && (
                  <a
                    href={`/ofis-detayi/${office.id}/`}
                    target="_blank"
                    className="ky-office-office-name"
                  >
                    {import.meta.env.VITE_APP_NAME} {office.name}
                  </a>
                )}

                <div className="separator my-10"></div>

                {officeAddress && (
                  <a
                    href={`https://maps.google.com/?q=${officeAddress}`}
                    target="_blank"
                    className="ky-office-row"
                  >
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="map"
                        iconType="solid"
                        className="fs-2 me-4"
                      />

                      <div className="d-flex flex-column">
                        <div className="ky-office-row-title">Ofis Adresi</div>
                      </div>
                    </div>
                  </a>
                )}

                <a href={`mailto:${office.email}`} className="ky-office-row">
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="sms"
                      iconType="solid"
                      className="fs-2 me-4"
                    />

                    <div className="d-flex flex-column">
                      <div className="ky-office-row-title">E-posta gönder</div>
                      <span className="ky-office-row-label">
                        {office.email}
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:${slugify(office.phoneNumber ?? "")}`}
                  className="ky-office-row"
                >
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="phone"
                      iconType="solid"
                      className="fs-2 me-4"
                    />

                    <div className="d-flex flex-column">
                      <div className="ky-office-row-title">Telefon et</div>
                      <span className="ky-office-row-label">
                        {office.phoneNumber}
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
                  Ofisten aldığınız hizmeti değerlendirin.
                </KYText>
              </div>

              <div className="col-lg-9">
                <nav className="ky-office-tab-nav">
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
                      className={`${activeTab === "users" ? "active" : ""}`}
                      onClick={() => setActiveTab("users")}
                    >
                      <span>Danışmanlar</span>
                    </li>
                    <li
                      className={`${activeTab === "comments" ? "active" : ""}`}
                      onClick={() => setActiveTab("comments")}
                    >
                      <span>Yorumlar</span>
                    </li>
                  </ul>
                </nav>

                <div
                  className={`ky-office-tab${
                    activeTab != "about" ? " d-none" : ""
                  }`}
                >
                  {office.about && (
                    <>
                      <div className="ky-office-about-title">
                        {office.about.title}
                      </div>
                      <div className="ky-office-about-description">
                        {office.about.description}
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`ky-office-tab${
                    activeTab != "properties"
                      ? " d-none"
                      : " d-flex flex-column"
                  }`}
                >
                  <OfficePropertiesList office={office} />
                </div>

                <div
                  className={`ky-office-tab${
                    activeTab != "users" ? " d-none" : " d-flex flex-column"
                  }`}
                >
                  <OfficeUsersList office={office} />
                </div>

                <div
                  className={`ky-office-tab${
                    activeTab != "comments" ? " d-none" : ""
                  }`}
                >
                  <OfficeCommentsList office={office} />
                </div>
              </div>
            </div>
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

export { OfficeDetail }
