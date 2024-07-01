import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { PropertiesListWrapper } from "./properties-list/PropertiesList"
import { AddProperty } from "./add-property/AddProperty"
import { APIProvider } from "@vis.gl/react-google-maps"

const propertiesBreadcrumbs: Array<PageLink> = [
  {
    title: "İlan Yönetimi",
    path: "ilan-yonetimi/ilanlar",
    isSeparator: false,
    isActive: false,
  },
]

const addPropertyBreadcrumbs: Array<PageLink> = [
  {
    title: "İlan Ekle",
    path: "ilan-yonetimi/ilan-ekle",
    isSeparator: false,
    isActive: false,
  },
]

const PropertiesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="ilanlar"
          element={
            <>
              <PageTitle breadcrumbs={propertiesBreadcrumbs}>İlanlar</PageTitle>
              <PropertiesListWrapper />
            </>
          }
        />
      </Route>
      <Route
        path="ilan-ekle"
        element={
          <>
            <PageTitle breadcrumbs={addPropertyBreadcrumbs}>
              İlan Ekle
            </PageTitle>
            <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}>
              <AddProperty />
            </APIProvider>
          </>
        }
      />
      <Route index element={<Navigate to="/ilan-yonetimi/ilanlar" />} />
    </Routes>
  )
}

export default PropertiesPage
