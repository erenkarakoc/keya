/* eslint-disable @typescript-eslint/no-explicit-any */
import "./PropertyDetail.css"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { useParams } from "react-router-dom"

import { KTIcon } from "../../../../_metronic/helpers"
import { KYText } from "../../components/KYText/KYText"
import { KYOfficeImage } from "../../components/KYOfficeImage/KYOfficeImage"

import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper as SwiperModel } from "swiper/types"
import { SwiperRef } from "swiper/react"

import { User } from "../../../modules/apps/user-management/_core/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"
import { Property } from "../../../modules/apps/property-management/_core/_models"

import { getPropertyById } from "../../../modules/apps/property-management/_core/_requests"
import { getUsersById } from "../../../modules/apps/user-management/_core/_requests"
import { getOfficeById } from "../../../modules/apps/office-management/_core/_requests"

import {
  convertPropertyDeedStatusText,
  convertPropertyForText,
  convertPropertyHeatingText,
  convertPropertyParkingLotText,
  convertPropertyTypeText,
  formatPrice,
  timestampToTurkishDate,
} from "../../../../_metronic/helpers/kyHelpers"

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps"

const PropertyDetail = () => {
  const { id } = useParams()
  const [property, setProperty] = useState<Property>()
  const [agents, setAgents] = useState<User[]>()
  const [office, setOffice] = useState<Office>()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)

  const lightboxSwiperRef = useRef<SwiperRef>(null)
  const [lightboxActive, setLightboxActive] = useState(false)

  const [activeTab, setActiveTab] = useState("details")

  const handleSlideChange = (swiper: SwiperModel) => {
    setCurrentSlide(swiper.realIndex)
    setTotalSlides(swiper.slides.length)
  }

  useEffect(() => {
    const fetchProperty = async () => {
      setProperty(await getPropertyById(id ?? ""))
    }

    fetchProperty()
  }, [id])

  useEffect(() => {
    if (property) {
      const fetchAgent = async () => {
        setAgents((await getUsersById(property.userIds)) ?? [])
      }

      const fetchOffice = async () => {
        setOffice(await getOfficeById(property.officeId))
      }

      fetchAgent()
      fetchOffice()
    }
  }, [property])

  const handleEscKeyDown = useCallback((event: any) => {
    if (event.key === "Escape") {
      setLightboxActive(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyDown, false)

    return () => {
      document.removeEventListener("keydown", handleEscKeyDown, false)
    }
  }, [handleEscKeyDown])

  return (
    <>
      {property ? (
        <div
          className={`ky-property-detail-lightbox${
            lightboxActive ? " active" : ""
          }`}
        >
          <div
            className="ky-property-detail-lightbox-close"
            onClick={() => setLightboxActive(false)}
          >
            <i className="bi bi-x"></i>
          </div>

          <Swiper
            ref={lightboxSwiperRef}
            style={
              {
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              } as React.CSSProperties
            }
            slidesPerView={1}
            loop={true}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
          >
            {property.propertyDetails.photoURLs.map((url, i) => (
              <SwiperSlide key={i}>
                <img src={url} alt={url} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        ""
      )}
      <div className="ky-page-property-detail">
        <div className="ky-page-content">
          {property ? (
            <>
              <div className="ky-property-detail-image">
                <div className="ky-property-detail-image-pagination">
                  {currentSlide + 1} / {totalSlides}
                </div>
                <Swiper
                  style={
                    {
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    } as React.CSSProperties
                  }
                  centeredSlides={true}
                  slidesPerView={3}
                  spaceBetween={10}
                  loop={true}
                  navigation={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  onSlideChange={(swiper) => handleSlideChange(swiper)}
                  className="mainImages"
                >
                  {property.propertyDetails.photoURLs.map((url, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={url}
                        onClick={() => {
                          setLightboxActive(true)
                          if (lightboxSwiperRef) {
                            lightboxSwiperRef.current?.swiper?.slideTo(i, 0)
                          }
                        }}
                      />
                      <span className="ky-property-detail-image-zoom">
                        <i className="bi bi-arrows-fullscreen"></i>
                      </span>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="row">
                <div className="col-lg-10 mx-auto">
                  <div className="ky-property-content">
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="ky-card">
                          <div className="ky-property-detail-header">
                            <div className="ky-property-header-title">
                              {property.title}
                            </div>

                            <div className="ky-property-header-price">
                              {formatPrice(property.propertyDetails.price)}
                            </div>
                          </div>

                          <div className="ky-seperator my-10"></div>

                          <nav className="ky-property-tab-nav">
                            <ul>
                              <li
                                className={`${
                                  activeTab === "details" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("details")}
                              >
                                <span>İlan Detayları</span>
                              </li>
                              <li
                                className={`${
                                  activeTab === "about" && "active"
                                }`}
                                onClick={() => setActiveTab("about")}
                              >
                                <span>İlan Açıklaması</span>
                              </li>

                              {property.propertyDetails.address.lat &&
                              property.propertyDetails.address.lng ? (
                                <li
                                  className={`${
                                    activeTab === "location" ? "active" : ""
                                  }`}
                                  onClick={() => setActiveTab("location")}
                                >
                                  <span>Konum</span>
                                </li>
                              ) : (
                                ""
                              )}
                            </ul>
                          </nav>

                          <div
                            className={`ky-property-tab${
                              activeTab != "details" ? " d-none" : ""
                            }`}
                          >
                            <div className="ky-property-details">
                              <div className="row">
                                <div className="col-md-6">
                                  <ul className="ky-property-details-table">
                                    {property.sahibindenNo && (
                                      <li>
                                        <span>Sahibinden</span>
                                        <span>
                                          <a
                                            href={`https://shbd.io/${property.sahibindenNo}`}
                                            target="_blank"
                                          >
                                            {property.sahibindenNo}
                                          </a>
                                        </span>
                                      </li>
                                    )}
                                    {property.emlakJetNo && (
                                      <li>
                                        <span>Emlakjet</span>
                                        <span>
                                          <a
                                            href={`https://emlakjet.com/ilan/${property.emlakJetNo}`}
                                            target="_blank"
                                          >
                                            {property.emlakJetNo}
                                          </a>
                                        </span>
                                      </li>
                                    )}
                                    <li>
                                      <span>İlan Tarihi</span>
                                      <span>
                                        {timestampToTurkishDate(
                                          property.createdAt
                                        )}
                                      </span>
                                    </li>
                                    <li>
                                      <span>Emlak Tipi</span>
                                      <span>
                                        {property.propertyDetails.for &&
                                          convertPropertyForText(
                                            property.propertyDetails.for
                                          )}{" "}
                                        {property.propertyDetails.type &&
                                          convertPropertyTypeText(
                                            property.propertyDetails.type
                                          )}
                                      </span>
                                    </li>
                                    {property.propertyDetails.squareGross && (
                                      <li>
                                        <span>m² (Brüt)</span>
                                        <span>
                                          {property.propertyDetails.squareGross}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.squareNet && (
                                      <li>
                                        <span>m² (Net)</span>
                                        <span>
                                          {property.propertyDetails.squareNet}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.room && (
                                      <li>
                                        <span>Oda Sayısı</span>
                                        <span>
                                          {property.propertyDetails.room}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.buildingAge && (
                                      <li>
                                        <span>Bina Yaşı</span>
                                        <span>
                                          {property.propertyDetails.buildingAge}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails
                                      .buildingAtFloor && (
                                      <li>
                                        <span>Bulunduğu Kat</span>
                                        <span>
                                          {
                                            property.propertyDetails
                                              .buildingAtFloor
                                          }
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails
                                      .buildingFloors && (
                                      <li>
                                        <span>Kat Sayısı</span>
                                        <span>
                                          {
                                            property.propertyDetails
                                              .buildingFloors
                                          }
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.heating && (
                                      <li>
                                        <span>Isıtma</span>
                                        <span>
                                          {convertPropertyHeatingText(
                                            property.propertyDetails.heating
                                          )}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.bathroom && (
                                      <li>
                                        <span>Banyo Sayısı</span>
                                        <span>
                                          {property.propertyDetails.bathroom}
                                        </span>
                                      </li>
                                    )}
                                    <li>
                                      <span>Balkon</span>
                                      <span>
                                        {property.propertyDetails.balcony ===
                                        "true"
                                          ? "Var"
                                          : "Yok"}
                                      </span>
                                    </li>
                                    <li>
                                      <span>Asansör</span>
                                      <span>
                                        {property.propertyDetails.elevator ===
                                        "true"
                                          ? "Var"
                                          : "Yok"}
                                      </span>
                                    </li>
                                    {
                                      <li>
                                        <span>Otopark</span>
                                        <span>
                                          {convertPropertyParkingLotText(
                                            property.propertyDetails
                                              .parkingLot ?? ""
                                          )}
                                        </span>
                                      </li>
                                    }
                                    <li>
                                      <span>Eşyalı</span>
                                      <span>
                                        {property.propertyDetails
                                          .withAccesories === "true"
                                          ? "Evet"
                                          : "Hayır"}
                                      </span>
                                    </li>
                                    {property.propertyDetails.heating && (
                                      <li>
                                        <span>Isıtma</span>
                                        <span>
                                          {convertPropertyHeatingText(
                                            property.propertyDetails.heating
                                          )}
                                        </span>
                                      </li>
                                    )}
                                    <li>
                                      <span>Site İçerisinde</span>
                                      <span>
                                        {property.propertyDetails.inComplex ===
                                        "true"
                                          ? "Evet"
                                          : "Hayır"}
                                      </span>
                                    </li>
                                    {property.propertyDetails.dues && (
                                      <li>
                                        <span>Aidat (TL)</span>
                                        <span>
                                          {formatPrice(
                                            property.propertyDetails.dues
                                          )}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.deedStatus && (
                                      <li>
                                        <span>Tapu Durumu</span>
                                        <span>
                                          {convertPropertyDeedStatusText(
                                            property.propertyDetails.deedStatus
                                          )}
                                        </span>
                                      </li>
                                    )}
                                    {property.propertyDetails.exchange && (
                                      <li>
                                        <span>Takas</span>
                                        <span>
                                          {property.propertyDetails.exchange ===
                                          "true"
                                            ? "Evet"
                                            : "Hayır"}
                                        </span>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                                <div className="col-md-6">
                                  {property.propertyDetails.featuresInner
                                    ?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>İç Özellikler</li>
                                      {property.propertyDetails.featuresInner.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {property.propertyDetails.featuresOuter
                                    ?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>Dış Özellikler</li>
                                      {property.propertyDetails.featuresOuter.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {property.propertyDetails
                                    .featuresNeighbourhood?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>Muhit</li>
                                      {property.propertyDetails.featuresNeighbourhood.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {property.propertyDetails
                                    .featuresTransportation?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>Ulaşım</li>
                                      {property.propertyDetails.featuresTransportation.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {property.propertyDetails.featuresView
                                    ?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>Manzara</li>
                                      {property.propertyDetails.featuresView.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {property.propertyDetails
                                    .featuresRealEstateType?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>Konut Tipi</li>
                                      {property.propertyDetails.featuresRealEstateType.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                  {property.propertyDetails.featuresForDisabled
                                    ?.length ? (
                                    <ul className="ky-property-features-table">
                                      <li>Engelliye ve Yaşlıya Uygun</li>
                                      {property.propertyDetails.featuresForDisabled.map(
                                        (feature, i) => (
                                          <li key={i}>
                                            <span>{feature}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`ky-property-tab${
                              activeTab != "about" ? " d-none" : ""
                            }`}
                          >
                            <div
                              className="ky-property-description"
                              dangerouslySetInnerHTML={{
                                __html:
                                  property.propertyDetails.description ?? "",
                              }}
                            />
                          </div>

                          {property.propertyDetails.address.lat &&
                          property.propertyDetails.address.lng ? (
                            <div
                              className={`ky-property-tab${
                                activeTab != "location" ? " d-none" : ""
                              }`}
                            >
                              <div className="ky-property-map">
                                <APIProvider
                                  apiKey={
                                    import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY
                                  }
                                >
                                  <Map
                                    mapId="ky-property-map"
                                    style={{
                                      width: "100%",
                                      height: 400,
                                    }}
                                    defaultCenter={{
                                      lat: property.propertyDetails.address.lat,
                                      lng: property.propertyDetails.address.lng,
                                    }}
                                    defaultZoom={18}
                                    gestureHandling={"greedy"}
                                    disableDefaultUI={true}
                                    streetViewControl={true}
                                    streetViewControlOptions={{
                                      position: 3,
                                    }}
                                    zoomControl={true}
                                    fullscreenControl={true}
                                    mapTypeControl={true}
                                  >
                                    <AdvancedMarker
                                      draggable={false}
                                      position={{
                                        lat: property.propertyDetails.address
                                          .lat,
                                        lng: property.propertyDetails.address
                                          .lng,
                                      }}
                                    />
                                  </Map>
                                </APIProvider>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="ky-card">
                          <div className="d-flex gap-10">
                            {agents && (
                              <div className="ky-property-agents">
                                <div className="ky-property-row-title mb-2">
                                  {agents.length > 1
                                    ? "Yetkili Danışmanlar"
                                    : "Yetkili Danışman"}
                                </div>

                                <div className="d-flex gap-2">
                                  {agents.map((agent) => (
                                    <>
                                      <div
                                        className="position-relative"
                                        key={agent.id}
                                      >
                                        <a
                                          href={`/kullanici-detayi/${agent.id}/`}
                                          key={agent.id}
                                          className="symbol symbol-circle symbol-60px with-tooltip overflow-hidden"
                                          style={{
                                            border: "2px solid #fff",
                                          }}
                                        >
                                          <div className="symbol-label">
                                            <img
                                              src={`${agent.photoURL}`}
                                              alt={agent.firstName}
                                              className="w-100"
                                            />
                                          </div>
                                        </a>
                                        <span className="symbol-tooltip">
                                          {`${agent.firstName} ${agent.lastName}`}
                                        </span>
                                      </div>
                                    </>
                                  ))}
                                </div>
                              </div>
                            )}

                            {office && (
                              <div className="ky-property-office">
                                <div className="ky-property-row-title mb-2">
                                  Yetkili Ofis
                                </div>

                                <a href={`/ofis-detayi/${office.id}/`}>
                                  <KYOfficeImage
                                    officeName={office.name}
                                    height={60}
                                    width={60}
                                  />
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="ky-seperator my-10"></div>

                          {property.propertyDetails.address.lat && (
                            <a
                              href={`https://maps.google.com/?q=${property.propertyDetails.address.lat},${property.propertyDetails.address.lng}`}
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
                                  <div className="ky-property-row-title">
                                    Yol Tarifi Al
                                  </div>
                                </div>
                              </div>
                            </a>
                          )}

                          {agents &&
                            agents.map((agent) => (
                              <a
                                href={`mailto:${agent.email}`}
                                className="ky-property-row"
                                key={agent.id}
                              >
                                <div className="d-flex align-items-center">
                                  <KTIcon
                                    iconName="sms"
                                    iconType="solid"
                                    className="fs-2 me-4"
                                  />

                                  <div className="d-flex flex-column">
                                    <div className="ky-property-row-title">
                                      Yetkiliye E-posta Gönder
                                    </div>
                                    <span className="ky-property-row-label">
                                      {agent.email}
                                    </span>
                                  </div>
                                </div>
                              </a>
                            ))}

                          {agents &&
                            agents.map((agent) => (
                              <a
                                href={`tel:${agent.phoneNumber}`}
                                className="ky-property-row"
                                key={agent.id}
                              >
                                <div className="d-flex align-items-center">
                                  <KTIcon
                                    iconName="phone"
                                    iconType="solid"
                                    className="fs-2 me-4"
                                  />

                                  <div className="d-flex flex-column">
                                    <div className="ky-property-row-title">
                                      Yetkiliye Telefon Et
                                    </div>
                                    <span className="ky-property-row-label">
                                      {agent.phoneNumber}
                                    </span>
                                  </div>
                                </div>
                              </a>
                            ))}

                          <div className="ky-seperator my-10"></div>

                          <div className="ky-button ky-button-secondary mb-4">
                            <button type="button">
                              <KTIcon
                                iconName="message-text-2"
                                iconType="solid"
                                className="fs-2 me-2 text-white"
                              />
                              Yorum Yaz
                            </button>
                          </div>
                          <KYText variant="caption">
                            Bu ilana bir yorum bırakın.
                          </KYText>
                        </div>
                      </div>
                    </div>
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
    </>
  )
}

export { PropertyDetail }
