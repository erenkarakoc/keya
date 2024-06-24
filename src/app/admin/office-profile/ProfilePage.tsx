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
import { Properties } from "./Properties/Properties"
import { Comments } from "./Comments/Comments"
import { EditOffice } from "./EditOffice/EditOffice"

import { ProfileHeader } from "./ProfileHeader"

import { Office } from "../../modules/apps/office-management/_core/_models"
import { getOfficeById } from "../../modules/apps/office-management/_core/_requests"

const ProfilePage = () => {
  const navigate = useNavigate()

  const { id } = useParams()
  const [office, setOffice] = useState<Office>()
  const [officeLoading, setOfficeLoading] = useState(true)
  const [currentAbout, setCurrentAbout] = useState<
    | {
        title: string
        description: string
      }
    | undefined
  >(undefined)

  const profileBreadCrumbs: Array<PageLink> = [
    {
      title: "Ofis Profili",
      path: `ofis-detayi/${office?.id}/genel`,
      isSeparator: false,
      isActive: false,
    },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const officeData = await getOfficeById(id ?? "")
      if (officeData) {
        setOffice(officeData)
      }
      setOfficeLoading(false)
    }

    fetchUser()
  }, [id])

  useEffect(() => {
    if (office && office.about?.title && office.about?.description) {
      setCurrentAbout({
        title: office.about.title,
        description: office.about.description,
      })
    }
  }, [office])

  return !officeLoading ? (
    office ? (
      <Routes>
        <Route
          element={
            <>
              <ProfileHeader office={office} />
              <Outlet />
            </>
          }
        >
          <Route
            path="genel"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>Genel</PageTitle>
                <Overview
                  office={office}
                  currentAbout={currentAbout}
                  setCurrentAbout={setCurrentAbout}
                />
              </>
            }
          />
          <Route
            path="portfoyler"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>
                  Portföyler
                </PageTitle>
                <Properties />
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
                <Comments office={office} />
              </>
            }
          />
          <Route
            path="duzenle"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>Düzenle</PageTitle>
                <EditOffice office={office} setOffice={setOffice} />
              </>
            }
          />

          <Route index element={<Navigate to="genel" />} />
        </Route>
      </Routes>
    ) : (
      <div className="card">
        <div className="card-body py-20 d-flex flex-column text-center">
          <h4>Ofis bulunamadı!</h4>
          <span className="text-gray-600 fw-semibold fs-7 ">
            Bu ofis silinmiş veya hiç var olmamış olabilir.
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
