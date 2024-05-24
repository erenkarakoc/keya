import { FC } from "react"
import { KYButton } from "../../../frontend/components/KYButton/KYButton"
import { toAbsoluteUrl } from "../../../../_metronic/helpers"
import "./Error.css"

const Error404: FC = () => {
  return (
    <>
      {/* begin::Title */}
      <h1 className="fw-bolder fs-2hx text-gray-900 mb-4">Üzgünüz!</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className="fw-semibold fs-6 text-gray-500 mb-7">
        Aradığınız sayfa yok veya kaldırılmış.
      </div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className="mb-3">
        <img
          src={toAbsoluteUrl("media/auth/404-error.png")}
          className="mw-100 mh-300px theme-light-show"
          alt=""
        />
        <img
          src={toAbsoluteUrl("media/auth/404-error-dark.png")}
          className="mw-100 mh-300px theme-dark-show"
          alt=""
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Link */}
      <div className="mb-0">
        <KYButton
          width="fit-content"
          to="/"
          text="Ana Sayfa'ya dön"
          className="ky-error-page-button mx-auto"
        />
      </div>
      {/* end::Link */}
    </>
  )
}

export { Error404 }
