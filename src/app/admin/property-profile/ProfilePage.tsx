import { useEffect, useState } from "react"
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom"

import { PageLink, PageTitle } from "../../../_metronic/layout/core"

import { Overview } from "./Overview/Overview"
import { Details } from "./Details/Details"
import { Comments } from "./Comments/Comments"

import { ProfileHeader } from "./ProfileHeader"

import { Property } from "../../modules/apps/property-management/_core/_models"
import { getPropertyById } from "../../modules/apps/property-management/_core/_requests"
import { EditProperty } from "./EditProperty/EditProperty"

const ProfilePage = () => {
  const navigate = useNavigate()

  const { id } = useParams()
  const [property, setProperty] = useState<Property>()
  const [propertyLoading, setPropertyLoading] = useState(true)

  const profileBreadCrumbs: Array<PageLink> = [
    {
      title: "İlan",
      path: `ilan-detayi/${property?.id}/genel`,
      isSeparator: false,
      isActive: false,
    },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const propertyData = await getPropertyById(id ?? "")
      if (propertyData) {
        setProperty(propertyData)
      }
      setPropertyLoading(false)
    }

    fetchUser()
  }, [id])

  return !propertyLoading ? (
    property ? (
      <Routes>
        <Route
          element={
            <>
              <ProfileHeader property={property} />
              <Outlet />
            </>
          }
        >
          <Route
            path="genel"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>Genel</PageTitle>
                <Overview property={property} />
              </>
            }
          />
          <Route
            path="ilan-bilgileri"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>
                  İlan Bilgileri
                </PageTitle>
                <Details property={property} />
              </>
            }
          />

          <Route
            path="yorumlar"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>
                  Müşteri Yorumları
                </PageTitle>
                <Comments property={property} />
              </>
            }
          />
          <Route
            path="duzenle"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>Düzenle</PageTitle>
                <EditProperty property={property} setProperty={setProperty} />
              </>
            }
          />

          <Route index element={<Navigate to="genel" />} />
        </Route>
      </Routes>
    ) : (
      <div className="card">
        <div className="card-body py-20 d-flex flex-column text-center">
          <h4>İlan bulunamadı!</h4>
          <span className="text-gray-600 fw-semibold fs-7 ">
            Bu ilan silinmiş veya hiç var olmamış olabilir.
          </span>

          <a onClick={() => navigate(-1)} className="mt-10" href="javascript:;">
            Geri dön
          </a>
        </div>
      </div>
    )
  ) : (
    <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
      <span className="spinner-border spinner-border-lg"></span>
    </div>
  )
}

export default ProfilePage
