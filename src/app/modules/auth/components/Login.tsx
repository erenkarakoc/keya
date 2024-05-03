import { useState } from "react"
import * as Yup from "yup"
import clsx from "clsx"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import { login } from "../core/_requests"
import { useAuth } from "../core/Auth"

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi gir")
    .min(3, "E-posta en az 3 karakterden oluşmalı")
    .max(50, "E-posta en fazla 50 karakterden oluşmalı")
    .required("E-posta alanı zorunludur."),
  password: Yup.string()
    .min(3, "Şifre en az 3 karakterden oluşmalı")
    .max(50, "Şifre en fazla 50 karakterden oluşmalı")
    .required("Şifre alanı zorunludur"),
})

const initialValues = {
  email: "erenkarakocw@gmail.com",
  password: "123456",
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const user = await login(values.email, values.password)
        setCurrentUser(user)
      } catch (error) {
        console.error(error)
        setStatus("E-posta veya şifre yanlış. Lütfen tekrar deneyin.")
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Giriş Yap</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          Bireysel veya kurumsal Keya hesabına giriş yap.
        </div>
      </div>
      {/* begin::Heading */}

      {formik.status ? (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      ) : (
        <div className="mb-10 bg-light-info p-8 rounded">
          <div className="text-info">
            Keya ailesinin bir üyesiysen, sana özel arayüzüne giriş yap ve
            işlemlerini <strong>kolayca gerçekleştir.</strong>
          </div>
        </div>
      )}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">
          E-posta
        </label>
        <input
          placeholder="Email"
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.email && formik.errors.email },
            {
              "is-valid": formik.touched.email && !formik.errors.email,
            }
          )}
          type="email"
          name="email"
          autoComplete="off"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Şifre
        </label>
        <input
          type="password"
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.password && formik.errors.password,
            },
            {
              "is-valid": formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        {/* begin::Link */}
        <Link to="/giris/sifremi-unuttum" className="link-primary">
          Şifreni mi unuttun?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Giriş Yap</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Lütfen bekleyin...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className="text-gray-500 text-center fw-semibold fs-6">
        Keya ailesinin bir parçası olmak için bizimle{" "}
        <Link to="/iletisim" className="link-primary">
          iletişime
        </Link>{" "}
        geçin.
        <br />
      </div>
    </form>
  )
}
