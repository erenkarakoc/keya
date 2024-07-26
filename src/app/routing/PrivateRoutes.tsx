import { FC, lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { MasterLayout } from "../../_metronic/layout/MasterLayout"
import TopBarProgress from "react-topbar-progress-indicator"
import { DashboardWrapper } from "../admin/dashboard/DashboardWrapper"
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils"
import { DisableSidebar } from "../../_metronic/layout/core"
import { WithChildren } from "../../_metronic/helpers"

const PrivateRoutes = () => {
  const WizardsPage = lazy(() => import("../modules/wizards/WizardsPage"))
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"))
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"))
  const UsersPage = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  )
  const PropertiesPage = lazy(
    () => import("../modules/apps/property-management/PropertiesPage")
  )
  const OfficesPage = lazy(
    () => import("../modules/apps/office-management/OfficesPage")
  )

  const FranchisePage = lazy(
    () => import("../modules/apps/franchise-management/FranchisePage")
  )
  const EmployerTransactionsPage = lazy(
    () => import("../modules/apps/transactions-management/EmployerTransactionsPage")
  )
  const OfficeTransactionsPage = lazy(
    () => import("../modules/apps/transactions-management/OfficeTransactionsPage")
  )
  const TransactionsPage = lazy(
    () => import("../modules/apps/transactions-management/TransactionsPage")
  )

  const UserProfilePage = lazy(
    () => import("../admin/user-profile/ProfilePage")
  )
  const OfficeProfilePage = lazy(
    () => import("../admin/office-profile/ProfilePage")
  )
  const PropertyProfilePage = lazy(
    () => import("../admin/property-profile/ProfilePage")
  )

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route index element={<DashboardWrapper />} />

        {/* Lazy Modules */}
        {/* <Route
          path="crafted/pages/profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        /> */}
        <Route
          path="crafted/pages/wizards/*"
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/widgets/*"
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />

        {/* Management */}
        <Route
          path="kullanici-yonetimi/*"
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path="ilan-yonetimi/*"
          element={
            <SuspensedView>
              <PropertiesPage />
            </SuspensedView>
          }
        />
        <Route
          path="ofis-yonetimi/*"
          element={
            <SuspensedView>
              <OfficesPage />
            </SuspensedView>
          }
        />
        <Route
          path="franchise-yonetimi/*"
          element={
            <SuspensedView>
              <FranchisePage />
            </SuspensedView>
          }
        />

        {/* Transaction Pages */}
          <Route
            path="idari-kadro-islemleri"
            element={
              <SuspensedView>
                <EmployerTransactionsPage />
              </SuspensedView>
            }
          />
          <Route
            path="ofis-islemleri"
            element={
              <SuspensedView>
                <OfficeTransactionsPage />
              </SuspensedView>
            }
          />
          <Route
            path="danisman-islemleri"
            element={
              <SuspensedView>
                <TransactionsPage />
              </SuspensedView>
            }
          />

        {/* Detail Pages */}
        <Route
          path="kullanici-detayi/:id/*"
          element={
            <SuspensedView>
              <UserProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="ofis-detayi/:id/*"
          element={
            <SuspensedView>
              <OfficeProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="ilan-detayi/:id/*"
          element={
            <SuspensedView>
              <PropertyProfilePage />
            </SuspensedView>
          }
        />

        <Route path="*" element={<Navigate to="/hata/404" />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary")
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return (
    <Suspense fallback={<TopBarProgress />}>
      <DisableSidebar>{children}</DisableSidebar>
    </Suspense>
  )
}

export { PrivateRoutes }
