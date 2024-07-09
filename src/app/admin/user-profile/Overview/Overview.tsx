import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

import { About } from "./components/About"
import { AddAboutModal } from "./components/AddAboutModal"
import { PropertyStatistics } from "./components/PropertyStatistics"
import { TransactionStatistics } from "./components/TransactionStatistics"
import { RevenueStatistics } from "./components/RevenueStatistics"

import { KTIcon } from "../../../../_metronic/helpers"
import { User } from "../../../modules/apps/user-management/_core/_models"
import {
  getStateById,
  getCityById,
  getCountryById,
  slugify,
} from "../../../../_metronic/helpers/kyHelpers"
import { Property } from "../../../modules/apps/property-management/_core/_models"
import { getPropertiesByUserIds } from "../../../modules/apps/property-management/_core/_requests"

interface OverviewProps {
  user: User
  currentAbout: { title: string; description: string } | undefined
  setCurrentAbout: Dispatch<
    SetStateAction<{ title: string; description: string } | undefined>
  >
}

const Overview: React.FC<OverviewProps> = ({
  user,
  currentAbout,
  setCurrentAbout,
}) => {
  const [showAddAboutModal, setShowAddAboutModal] = useState<boolean>(false)
  const [userAddress, setUserAddress] = useState("")
  const [properties, setProperties] = useState<Property[]>()

  useEffect(() => {
    const fetchAddress = async () => {
      let country = ""
      let state = ""
      let city = ""

      if (user.address?.country) {
        const countryData = await getCountryById(user.address.country)
        country = countryData ? countryData.translations.tr : ""
      }
      if (user.address?.state) {
        const stateData = await getStateById(user.address.state)
        state = stateData ? stateData.name : ""
      }
      if (user.address?.city) {
        const cityData = await getCityById(user.address.city)
        city = cityData ? cityData.name : ""
      }

      const addressString = `${city ? city + ", " : ""}${
        state ? state + ", " : ""
      }${country ? country : ""}`

      setUserAddress(
        user.address?.addressLine
          ? user.address?.addressLine + ", " + addressString
          : addressString
      )
    }

    const fetchProperties = async () => {
      const propertiesArr: Property[] = await getPropertiesByUserIds([user.id])
      if (propertiesArr) setProperties(propertiesArr)

      console.log(propertiesArr)
    }

    fetchProperties()
    fetchAddress()
  }, [user])

  return (
    <div className="row g-5 g-xxl-8">
      <div className="col-xl-6">
        {currentAbout ? (
          <About
            className="mb-xxl-8 h-100"
            about={currentAbout}
            setShowAddAboutModal={setShowAddAboutModal}
          />
        ) : (
          <div className="card card-body p-8 justify-content-center align-items-center text-center h-100">
            <span className="text-gray-600 fw-bold fs-6">
              Kullanıcıya ait hakkında bilgisi yok.
            </span>
            <button
              type="button"
              className="btn btn-light-primary w-fit-content mt-5"
              onClick={() => setShowAddAboutModal(true)}
            >
              <KTIcon iconName="plus" className="fs-2" />
              Ekle
            </button>
          </div>
        )}
      </div>

      <div className="col-xl-6">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="fs-6 fw-semibold mb-5">İletişim:</div>
            </div>
            <div className="border border-gray-300 border-dashed rounded min-w-125px me-6 mb-4">
              <a
                href={`tel:${slugify(user.phoneNumber ?? "")}`}
                className="fw-bold fs-6 text-gray-500 text-hover-primary d-flex align-items-center py-3 px-4 "
              >
                <KTIcon iconName="phone" className="fs-2 me-2" />
                {user.phoneNumber}
              </a>
            </div>
            <div className="border border-gray-300 border-dashed rounded min-w-125px me-6 mb-6">
              <a
                href={`mailto:${user.email}`}
                className="fw-bold fs-6 text-gray-500 text-hover-primary d-flex align-items-center py-3 px-4"
              >
                <KTIcon iconName="sms" className="fs-2 me-2" />
                {user.email}
              </a>
            </div>

            {userAddress && (
              <div className="border border-gray-300 border-dashed rounded min-w-125px me-6 mb-6">
                <a
                  href={`https://maps.google.com/?q=${userAddress}`}
                  target="_blank"
                  className="fw-bold fs-6 text-gray-500 text-hover-primary d-flex align-items-center py-3 px-4"
                >
                  <KTIcon iconName="map" className="fs-1 me-2" />
                  {userAddress}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {properties && (
        <div className="col-xl-6">
          <PropertyStatistics properties={properties} />
        </div>
      )}

      <div className="col-xl-6">
        <TransactionStatistics />
      </div>

      <div className="col-xl-6">
        <RevenueStatistics />
      </div>

      <AddAboutModal
        user={user}
        currentAbout={currentAbout}
        setCurrentAbout={setCurrentAbout}
        show={showAddAboutModal}
        setShow={setShowAddAboutModal}
      />
    </div>
  )
}

export { Overview }
