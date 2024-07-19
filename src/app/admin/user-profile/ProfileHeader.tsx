import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers"

import {
  formatPrice,
  getUserRoleText,
} from "../../../_metronic/helpers/kyHelpers"
import { User } from "../../modules/apps/user-management/_core/_models"
import { KYOfficeImage } from "../../frontend/components/KYOfficeImage/KYOfficeImage"
import { getOfficeById } from "../../modules/apps/office-management/_core/_requests"
import { Office } from "../../modules/apps/office-management/_core/_models"
import { Transaction } from "../../modules/apps/transactions-management/_core/_models"
import { getThisMonthsTransactionsByUserId } from "../../modules/apps/transactions-management/_core/_requests"
import { Property } from "../../modules/apps/property-management/_core/_models"
import { getPropertiesByUserIds } from "../../modules/apps/property-management/_core/_requests"

interface Props {
  user: User
}

const ProfileHeader: React.FC<Props> = ({ user }) => {
  const location = useLocation()

  const [office, setOffice] = useState<Office>()
  const [properties, setProperties] = useState<Property[]>()

  const [thisMonthsTransactions, setThisMonthsTransactions] =
    useState<Transaction[]>()
  const [thisMonthsProfit, setThisMonthsProfit] = useState(0)

  useEffect(() => {
    const fetchOffice = async () => {
      setOffice(await getOfficeById(user.officeId))
    }

    const fetchProperties = async () => {
      setProperties(await getPropertiesByUserIds([user.id]))
    }

    const fetchThisMonthsTransactions = async () => {
      setThisMonthsTransactions(
        await getThisMonthsTransactionsByUserId(user.id)
      )
    }

    fetchOffice()
    fetchProperties()
    fetchThisMonthsTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    const calculateThisMonthsProfit = () => {
      if (thisMonthsTransactions) {
        let profit = 0

        thisMonthsTransactions.map((transaction: Transaction) => {
          profit = profit + Number(transaction.agentProfit)
        })

        setThisMonthsProfit(profit)
      }
    }

    calculateThisMonthsProfit()
  }, [thisMonthsTransactions])

  return (
    <div className="card mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
          <div className="me-7 mb-4">
            <div
              className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative"
              style={{ aspectRatio: "1 / 1.33" }}
            >
              <img
                className="object-fit-cover h-100"
                src={
                  user.photoURL
                    ? user.photoURL
                    : toAbsoluteUrl("/media/avatars/blank.jpg")
                }
                alt={user.firstName + " " + user.lastName}
              />
            </div>
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <span className="text-gray-800 fs-2 fw-bolder me-1">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>

                <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                  <span className="d-flex align-items-center text-gray-500 me-5 mb-2">
                    {getUserRoleText(user.role)}
                  </span>
                </div>
              </div>

              <div className="d-flex my-4">
                <div className="me-0">
                  <Link
                    to={`/arayuz/kullanici-detayi/${user.id}/duzenle`}
                    className={
                      `btn btn-sm btn-icon btn-bg-light btn-active-color-primary` +
                      (location.pathname ===
                      `/arayuz/kullanici-detayi/${user.id}/duzenle`
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
                      <div className="fs-2 fw-bolder">
                        {formatPrice(thisMonthsProfit.toString())}
                      </div>
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
                      <div className="fs-2 fw-bolder">{properties?.length}</div>
                    </div>

                    <div className="fw-bold fs-6 text-gray-500">Portföy</div>
                  </div>

                  {office && (
                    <div className="py-3 pr-4 me-6 mb-3">
                      <a
                        href={`/arayuz/ofis-detayi/${office.id}`}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <KYOfficeImage
                          height={50}
                          width={50}
                          officeName={office.name}
                        />
                      </a>
                    </div>
                  )}
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
                    `/arayuz/kullanici-detayi/${user.id}/genel` && "active")
                }
                to={`/arayuz/kullanici-detayi/${user.id}/genel`}
              >
                Genel
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/kullanici-detayi/${user.id}/portfoyler` &&
                    "active")
                }
                to={`/arayuz/kullanici-detayi/${user.id}/portfoyler`}
              >
                Portföyler
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/arayuz/kullanici-detayi/${user.id}/yorumlar` && "active")
                }
                to={`/arayuz/kullanici-detayi/${user.id}/yorumlar`}
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
