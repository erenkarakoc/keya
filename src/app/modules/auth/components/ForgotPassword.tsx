import { useState } from "react"
import * as Yup from "yup"
import clsx from "clsx"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import { sendPasswordResetEmail } from "firebase/auth"
import { firebaseAuth } from "../../../../firebase/BaseConfig"

const initialValues = {
  email: "erenkarakocw@gmail.com",
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        await sendPasswordResetEmail(firebaseAuth, values.email)
        setResetSuccess(true)
      } catch (error) {
        console.error(error)
        setResetSuccess(false)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_password_reset_form"
      onSubmit={formik.handleSubmit}
    >
      <div className="text-center mb-10">
        <h1 className="text-gray-900 fw-bolder mb-3">Forgot Password ?</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          Enter your email to reset your password.
        </div>
      </div>

      {resetSuccess && (
        <div className="mb-10 bg-light-info p-8 rounded">
          <div className="text-info">
            Password reset email sent. Please check your email.
          </div>
        </div>
      )}

      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">Email</label>
        <input
          type="email"
          placeholder=""
          autoComplete="off"
          {...formik.getFieldProps("email")}
          className={clsx("form-control bg-transparent", {
            "is-invalid": formik.touched.email && formik.errors.email,
          })}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          className="btn btn-primary me-4"
          disabled={loading}
        >
          <span className="indicator-label">Submit</span>
          {loading && (
            <span className="indicator-progress">
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
        <Link to="/auth/login">
          <button
            type="button"
            className="btn btn-light"
            disabled={formik.isSubmitting || !formik.isValid || loading}
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  )
}
