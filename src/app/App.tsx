import { Suspense, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { I18nProvider } from "../_metronic/i18n/i18nProvider"
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core"
import { MasterInit } from "../_metronic/layout/MasterInit"
import { AuthInit } from "./modules/auth"
import { ThemeModeProvider } from "../_metronic/partials/layout/theme-mode/ThemeModeProvider"

const App = () => {
  const location = useLocation()

  useEffect(() => {
    document.querySelector(".ky-layout")?.scroll(0, 0)
  }, [location])

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export { App }
