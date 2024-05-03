import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { UsersListWrapper } from "./users-list/UsersList"

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: "Kullanıcı Yönetimi",
    path: "kullanici-yonetimi/kullanicilar",
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

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="kullanicilar"
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Kullanıcılar</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route
        index
        element={<Navigate to="/kullanici-yonetimi/kullanicilar" />}
      />
    </Routes>
  )
}

export default UsersPage
