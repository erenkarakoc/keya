import "./Error.css"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { toAbsoluteUrl } from "../../../../_metronic/helpers"

const Error500: FC = () => {
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  return (
    <>
      {/* begin::Title */}
      <h1 className="fw-bolder fs-2qx text-gray-900 mb-4">Hata</h1>
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
        <a
          onClick={goBack}
          className="ky-button ky-button-secondary w-fit-content px-5 fw-bold mx-auto"
          style={{ color: "var(--ky-light)" }}
        >
          Geri Dön
        </a>
      </div>
      {/* end::Link */}
    </>
  )
}

export { Error500 }
