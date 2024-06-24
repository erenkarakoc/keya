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
import { EditUser } from "./EditUser/EditUser"

import { ProfileHeader } from "./ProfileHeader"

import { User } from "../../modules/apps/user-management/_core/_models"
import { getUserById } from "../../modules/apps/user-management/_core/_requests"

const ProfilePage = () => {
  const navigate = useNavigate()

  const { id } = useParams()
  const [user, setUser] = useState<User>()
  const [userLoading, setUserLoading] = useState(true)
  const [currentAbout, setCurrentAbout] = useState<
    | {
        title: string
        description: string
      }
    | undefined
  >(undefined)

  const profileBreadCrumbs: Array<PageLink> = [
    {
      title: "Kullanıcı Profili",
      path: `kullanici-detayi/${user?.id}/genel`,
      isSeparator: false,
      isActive: false,
    },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(id)
      if (userData) {
        setUser(userData)
      }
      setUserLoading(false)
    }

    fetchUser()
  }, [id])

  useEffect(() => {
    if (user && user.about?.title && user.about?.description) {
      setCurrentAbout({
        title: user.about.title,
        description: user.about.description,
      })
    }
  }, [user])

  return !userLoading ? (
    user ? (
      <Routes>
        <Route
          element={
            <>
              <ProfileHeader user={user} />
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
                  user={user}
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
                <Comments user={user} />
              </>
            }
          />
          <Route
            path="duzenle"
            element={
              <>
                <PageTitle breadcrumbs={profileBreadCrumbs}>Düzenle</PageTitle>
                <EditUser user={user} setUser={setUser} />
              </>
            }
          />

          <Route index element={<Navigate to="genel" />} />
        </Route>
      </Routes>
    ) : (
      <div className="card">
        <div className="card-body py-20 d-flex flex-column text-center">
          <h4>Kullanıcı bulunamadı!</h4>
          <span className="text-gray-600 fw-semibold fs-7 ">
            Bu kullanıcı silinmiş veya hiç var olmamış olabilir.
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
