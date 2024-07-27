import React, { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

import { KTIcon } from "../../../_metronic/helpers"

import { KYOfficeImage } from "../../frontend/components/KYOfficeImage/KYOfficeImage"

import {
  getCountryById,
  getStateById,
} from "../../../_metronic/helpers/kyHelpers"

import { Office } from "../../modules/apps/office-management/_core/_models"
import { Property } from "../../modules/apps/property-management/_core/_models"
import { getPropertiesByOfficeId } from "../../modules/apps/property-management/_core/_requests"

interface Props {
  office: Office
}

const ProfileHeader: React.FC<Props> = ({ office }) => {
  const { id } = useParams()
  const location = useLocation()

  const [propertiesLength, setPropertiesLength] = useState(0)

  const [currentCountry, setCurrentCountry] = useState("")
  const [currentState, setCurrentState] = useState("")

  useEffect(() => {
    const fetchAddress = async () => {
      if (office.address.country) {
        console.log(office.address)
        const countryName = await getCountryById(office.address.country)
        setCurrentCountry(countryName?.translations.tr ?? "")
      }
      if (office.address.state) {
        const stateName = await getStateById(office.address.state)
        setCurrentState(stateName?.name ?? "")
      }
    }

    fetchAddress()
  }, [office])

  useEffect(() => {
    const fetchProperties = async () => {
      if (id) {
        const propertiesArr: Property[] = await getPropertiesByOfficeId(id)
        setPropertiesLength(propertiesArr.length)
      }
    }

    fetchProperties()
  }, [id])

  return (
    <div className="card mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
          <div className="me-7 mb-4">
            <KYOfficeImage height={150} width={150} officeName={office.name} />
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <span className="text-gray-800 fs-2 fw-bolder me-1">
                    {import.meta.env.VITE_APP_NAME} {office.name}
                  </span>
                </div>

                <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                  <span className="d-flex align-items-center text-gray-500 me-5 mb-2">
                    {currentState && currentState + ", "}
                    {currentCountry && currentCountry}
                  </span>
                </div>
              </div>

              <div className="d-flex my-4">
                <div className="me-0">
                  <Link
                    to={`/arayuz/ofis-detayi/${office.id}/duzenle`}
                    className={
                      `btn btn-sm btn-icon btn-bg-light btn-active-color-primary` +
                      (location.pathname ===
                      `/arayuz/ofis-detayi/${office.id}/duzenle`
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
            </div>

            <div className="d-flex flex-wrap flex-stack">
              <div className="d-flex flex-column flex-grow-1 pe-8">
                <div className="d-flex flex-wrap">
                  <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="arrow-up"
                        className="fs-3 text-success me-2"
                      />
                      <div className="fs-2 fw-bolder">15.000₺</div>
                    </div>

                    <div className="fw-bold fs-6 text-gray-500">
                      Bu ayki kazanç
                    </div>
                  </div>

                  <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="arrow-down"
                        className="fs-3 text-danger me-2"
                      />
                      <div className="fs-2 fw-bolder">{propertiesLength}</div>
                    </div>

                    <div className="fw-bold fs-6 text-gray-500">Portföy</div>
                  </div>
                </div>
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
                    `/arayuz/ofis-detayi/${office.id}/genel` && "active")
                }
                to={`/arayuz/ofis-detayi/${office.id}/genel`}
              >
                Genel
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/ofis-detayi/${office.id}/portfoyler` && "active")
                }
                to={`/arayuz/ofis-detayi/${office.id}/portfoyler`}
              >
                Portföyler
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/ofis-detayi/${office.id}/yorumlar` && "active")
                }
                to={`/arayuz/ofis-detayi/${office.id}/yorumlar`}
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
