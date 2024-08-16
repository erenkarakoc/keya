import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { Property } from "../../modules/apps/property-management/_core/_models"
import {
  convertToTurkishDate,
  formatPrice,
} from "../../../_metronic/helpers/kyHelpers"

import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

import "./ProfileHeader.css"

import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper as SwiperModel } from "swiper/types"
import { KTIcon } from "../../../_metronic/helpers"
import { User } from "../../modules/apps/user-management/_core/_models"
import { getUserById } from "../../modules/apps/user-management/_core/_requests"
import { useAuth } from "../../modules/auth"

interface Props {
  property: Property
}

const ProfileHeader: React.FC<Props> = ({ property }) => {
  const { currentUser } = useAuth()
  const location = useLocation()
  const [users, setUsers] = useState<User[]>([])

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperModel | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersArr: User[] = []

        if (property.userIds) {
          await Promise.all(
            property.userIds.map(async (id) => {
              const user = await getUserById(id)

              if (user) {
                usersArr.push(user)
              }
            })
          )

          setUsers(usersArr)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [property])

  return (
    <div className="property-profile-header card mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-0">
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-6 mb-md-0">
            {property.propertyDetails.photoURLs.length > 0 ? (
              <>
                <Swiper
                  style={
                    {
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    } as React.CSSProperties
                  }
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mainImages"
                >
                  {property.propertyDetails.photoURLs.map((url, i) => (
                    <SwiperSlide key={i}>
                      <img src={url} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbnailSwiper"
                >
                  {property.propertyDetails.photoURLs.map((url, i) => (
                    <SwiperSlide key={i}>
                      <img src={url} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center text-center text-gray-500 h-100 w-100 p-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m20.475 23.3l-2.3-2.3H5q-.825 0-1.413-.588T3 19V5.825L.7 3.5l1.4-1.4l19.8 19.8l-1.425 1.4ZM5 19h11.175l-2-2H6l3-4l2 2.725l.85-1.05L5 7.825V19Zm16-.825l-2-2V5H7.825l-2-2H19q.825 0 1.413.588T21 5v13.175Zm-7.525-7.525ZM10.6 13.425Z"
                  />
                </svg>
                <span className="mt-3">
                  Lütfen daha iyi bir kullanıcı deneyimi için ilana ait
                  görselleri ekleyin.
                </span>
              </div>
            )}
          </div>

          <div className="col-md-6 col-lg-8">
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-gray-800 fs-2 fw-bolder me-1">
                      {property.title}
                    </span>
                  </div>

                  <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a
                      href={`https://maps.google.com/?q=${property.propertyDetails.address.label}`}
                      target="_blank"
                      className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      {property.propertyDetails.address.label}
                    </a>
                  </div>
                </div>

                {currentUser &&
                (currentUser?.role === "admin" ||
                  currentUser?.role === "assistant" ||
                  property.userIds.includes(currentUser?.id)) &&
                property.officeId === currentUser?.officeId ? (
                  <div className="d-flex my-4">
                    <div className="me-0">
                      <Link
                        to={`/arayuz/ilan-detayi/${property.id}/duzenle`}
                        className={
                          `btn btn-sm btn-icon btn-bg-light btn-active-color-primary` +
                          (location.pathname ===
                          `/arayuz/ilan-detayi/${property.id}/duzenle`
                            ? " btn-color-primary"
                            : "")
                        }
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                        data-kt-menu-flip="top-end"
                      >
                        <i className="bi bi-gear-fill fs-6"></i>
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="d-flex flex-wrap flex-stack mb-2">
                <div className="d-flex flex-column flex-grow-1 pe-8">
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="fs-2 fw-bolder">
                          {formatPrice(property.propertyDetails.price)}
                        </div>
                      </div>

                      <div className="fw-bold fs-6 text-gray-500">Fiyat</div>
                    </div>

                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="fs-2 fw-bolder">
                          {property.ownerDetails?.permitUntilDate &&
                            (property.ownerDetails?.permitUntilDate ===
                            "limitless"
                              ? "Süresiz"
                              : convertToTurkishDate(
                                  property.ownerDetails?.permitUntilDate
                                ))}
                        </div>
                      </div>

                      <div className="fw-bold fs-6 text-gray-500">
                        Yetki Bitiş Tarihi
                      </div>
                    </div>

                    {users.map((user, i) => {
                      const initials =
                        user.firstName && user.lastName
                          ? user.firstName.charAt(0) + user.lastName.charAt(0)
                          : ""

                      return (
                        <div className="position-relative" key={i}>
                          <a
                            href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                            key={user.id}
                            className="symbol symbol-circle symbol-60px with-tooltip overflow-hidden"
                            style={{
                              marginRight: -15,
                              border: "3px solid #fff",
                            }}
                          >
                            <div className="symbol-label">
                              {user.photoURL ? (
                                <img
                                  src={`${user.photoURL}`}
                                  alt={user.firstName}
                                  className="w-100"
                                />
                              ) : (
                                <div className="symbol-label fs-2 fw-bolder text-white bg-primary">
                                  {initials}
                                </div>
                              )}
                            </div>
                          </a>
                          <span className="symbol-tooltip">
                            {`${user.firstName} ${user.lastName}`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap mb-2">
                <a
                  href={`/ilan-detayi/${property.id}/`}
                  target="_blank"
                  className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
                >
                  <span className="d-flex align-items-center justify-content-between fs-7 fw-bolder">
                    İlan Sayfası
                    <KTIcon
                      iconName="exit-right-corner"
                      iconType="outline"
                      className="text-primary ms-3"
                    />
                  </span>
                </a>

                {property.sahibindenNo && (
                  <a
                    href={`https://shbd.io/${property.sahibindenNo}`}
                    target="_blank"
                    className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
                  >
                    <span className="d-flex align-items-center justify-content-between fs-7 fw-bolder">
                      Sahibinden
                      <KTIcon
                        iconName="exit-right-corner"
                        iconType="outline"
                        className="text-primary ms-3"
                      />
                    </span>
                  </a>
                )}

                {property.emlakJetNo && (
                  <a
                    href={`https://www.emlakjet.com/ilan/${property.emlakJetNo}`}
                    target="_blank"
                    className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
                  >
                    <span className="d-flex align-items-center justify-content-between fs-7 fw-bolder">
                      Emlakjet
                      <KTIcon
                        iconName="exit-right-corner"
                        iconType="outline"
                        className="text-primary ms-3"
                      />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex overflow-auto h-55px">
          <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/ilan-detayi/${property.id}/genel` && "active")
                }
                to={`/arayuz/ilan-detayi/${property.id}/genel`}
              >
                İlan Açıklaması
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/ilan-detayi/${property.id}/ilan-bilgileri` &&
                    "active")
                }
                to={`/arayuz/ilan-detayi/${property.id}/ilan-bilgileri`}
              >
                İlan Bilgileri
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/ilan-detayi/${property.id}/yorumlar` && "active")
                }
                to={`/arayuz/ilan-detayi/${property.id}/yorumlar`}
              >
                Müşteri Yorumları
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
