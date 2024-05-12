import React, { FC } from "react"
import { ErrorMessage, Field } from "formik"

const Step1: FC = () => {
  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Kullanıcı Bilgileri</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Genel kullanıcı bilgilerini girin. Kullanıcı giriş bilgilerini
          (e-posta & şifre) kullanıcıya iletmeyi unutmayın.
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-6">
          <label className="form-label required mb-3">Ad</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="first_name"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="first_name" />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label required mb-3">Soyad</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="last_name"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="last_name" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row">
        <label className="form-label required mb-3">E-posta</label>

        <Field
          type="email"
          className="form-control form-control-lg form-control-solid"
          name="email"
        />
        <div className="text-danger mt-2">
          <ErrorMessage name="email" />
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-6">
          <label className="form-label required mb-3">Şifre</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="password"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="password" />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label required mb-3">Şifre Tekrarı</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="confirmpassword"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="confirmpassword" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step1 }
