import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { OfficesListWrapper } from "./offices-list/OfficesList"

const officesBreadcrumbs: Array<PageLink> = [
  {
    title: "Ofis Yönetimi",
    path: "ofis-yonetimi/ofisler",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
]

const OfficesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="kullanicilar"
          element={
            <>
              <PageTitle breadcrumbs={officesBreadcrumbs}>Ofisler</PageTitle>
              <OfficesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/ofis-yonetimi/ofisler" />} />
    </Routes>
  )
}

export default OfficesPage
