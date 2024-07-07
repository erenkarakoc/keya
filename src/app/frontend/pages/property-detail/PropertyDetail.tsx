import "./PropertyDetail.css"
import React, { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { KTIcon } from "../../../../_metronic/helpers"

import { KYText } from "../../components/KYText/KYText"
import { Property } from "../../../modules/apps/property-management/_core/_models"
import { getPropertyById } from "../../../modules/apps/property-management/_core/_requests"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { formatPrice } from "../../../../_metronic/helpers/kyHelpers"

const PropertyDetail = () => {
  const { id } = useParams()
  const [property, setProperty] = useState<Property>()

  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    const fetchProperty = async () => {
      setProperty(await getPropertyById(id ?? ""))
    }

    fetchProperty()
  }, [id])

  return (
    <div className="ky-page-property-detail">
      <div className="ky-page-content">
        {property ? (
          <>
            <div className="ky-property-detail-image">
              <Swiper
                style={
                  {
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  } as React.CSSProperties
                }
                slidesPerView={3}
                spaceBetween={10}
                navigation={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mainImages"
              >
                {property.propertyDetails.photoURLs.map((url, i) => (
                  <SwiperSlide key={i}>
                    <img src={url} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="ky-property-name">{property.title}</div>

            {property && (
              <a
                href={`/ofis-detayi/${property.id}/`}
                target="_blank"
                className="ky-property-office-name"
              >
                {property.propertyDetails.address.label}
              </a>
            )}

            <div className="ky-property-name">
              {formatPrice(property.propertyDetails.price)}
            </div>

            <div className="separator my-10"></div>

            {property.propertyDetails.address.label && (
              <a
                href={`https://maps.google.com/?q=${property.propertyDetails.address.label}`}
                target="_blank"
                className="ky-property-row"
              >
                <div className="d-flex align-items-center">
                  <KTIcon
                    iconName="map"
                    iconType="solid"
                    className="fs-2 me-4"
                  />

                  <div className="d-flex flex-column">
                    <div className="ky-property-row-title">Ofis Adresi</div>
                  </div>
                </div>
              </a>
            )}

            <a href={`mailto:email@mail.com`} className="ky-property-row">
              <div className="d-flex align-items-center">
                <KTIcon iconName="sms" iconType="solid" className="fs-2 me-4" />

                <div className="d-flex flex-column">
                  <div className="ky-property-row-title">E-posta gönder</div>
                  <span className="ky-property-row-label">
                    bahadirangun@keya.com.tr
                  </span>
                </div>
              </div>
            </a>

            <a href={`tel:905435390665}`} className="ky-property-row">
              <div className="d-flex align-items-center">
                <KTIcon
                  iconName="phone"
                  iconType="solid"
                  className="fs-2 me-4"
                />

                <div className="d-flex flex-column">
                  <div className="ky-property-row-title">Telefon et</div>
                  <span className="ky-property-row-label">
                    +90 543 539 06 65
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

            <div className="col-lg-9">
              <nav className="ky-property-tab-nav">
                <ul>
                  <li
                    className={`${activeTab === "about" && "active"}`}
                    onClick={() => setActiveTab("about")}
                  >
                    <span>İlan Açıklaması</span>
                  </li>
                  <li
                    className={`${activeTab === "details" ? "active" : ""}`}
                    onClick={() => setActiveTab("details")}
                  >
                    <span>İlan Detayları</span>
                  </li>
                </ul>
              </nav>

              <div
                className={`ky-property-tab${
                  activeTab != "about" ? " d-none" : ""
                }`}
              >
                <div className="ky-card">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: property.propertyDetails.description ?? "",
                    }}
                  />
                </div>
              </div>

              <div
                className={`ky-property-tab${
                  activeTab != "details" ? " d-none" : ""
                }`}
              >
                <div className="fs-5 text-gray-700">
                  İlana dair detay bilgisi yok.
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
            <span className="spinner-border spinner-border-lg"></span>
          </div>
        )}
      </div>
    </div>
  )
}

export { PropertyDetail }
