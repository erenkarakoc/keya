import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { OfficesListWrapper } from "./offices-list/OfficesList"
import { AddOffice } from "./add-office/AddOffice"
import { useAuth } from "../../auth"

const officesBreadcrumbs: Array<PageLink> = [
  {
    title: "Ofis Yönetimi",
    path: "ofis-yonetimi/ofisler",
    isSeparator: false,
    isActive: false,
  },
]

const addOfficeBreadcrumbs: Array<PageLink> = [
  {
    title: "Ofis Ekle",
    path: "ofis-yonetimi/ofis-ekle",
    isSeparator: false,
    isActive: false,
  },
]

const OfficesPage = () => {
  const { currentUser } = useAuth()

  return (
    <Routes>
      {currentUser?.role === "admin" ||
      currentUser?.role === "franchise-manager" ? (
        <>
          <Route element={<Outlet />}>
            <Route
              path="ofisler"
              element={
                <>
                  <PageTitle breadcrumbs={officesBreadcrumbs}>
                    Ofisler
                  </PageTitle>
                  <OfficesListWrapper />
                </>
              }
            />
          </Route>{" "}
          <Route
            path="ofis-ekle"
            element={
              <>
                <PageTitle breadcrumbs={addOfficeBreadcrumbs}>
                  Ofis Ekle
                </PageTitle>
                <AddOffice />
              </>
            }
          />
        </>
      ) : (
        ""
      )}

      <Route index element={<Navigate to="/ofis-yonetimi/ofisler" />} />
    </Routes>
  )
}

export default OfficesPage
