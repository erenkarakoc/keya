import { FC } from "react"
import { toAbsoluteUrl } from "../../../../_metronic/helpers"
import { KYButton } from "../../../frontend/components/KYButton/KYButton"
import "./Error.css"

const Error500: FC = () => {
  return (
    <>
      {/* begin::Title */}
      <h1 className="fw-bolder fs-2qx text-gray-900 mb-4">Sunucu Hatası</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className="fw-semibold fs-6 text-gray-500 mb-7">
        Bir hatayla karşılaştık! Lütfen daha sonra tekrar deneyin.
      </div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className="mb-11">
        <img
          src={toAbsoluteUrl("media/auth/500-error.png")}
          className="mw-100 mh-300px theme-light-show"
          alt=""
        />
        <img
          src={toAbsoluteUrl("media/auth/500-error-dark.png")}
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

export { Error500 }
