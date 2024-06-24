import React, { ChangeEvent, FC, useEffect, useState } from "react"
import { ErrorMessage, Field } from "formik"
import { getUserEmails } from "../../../_core/_requests"

interface Step1Props {
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
}

const Step1: FC<Step1Props> = ({ setFieldValue }) => {
  const [currentEmail, setCurrentEmail] = useState("")
  const [emails, setEmails] = useState<string[]>()
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)

  useEffect(() => {
    const fetchEmails = async () => setEmails(await getUserEmails())

    fetchEmails()
  }, [])

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
            name="firstName"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="firstName" />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label required mb-3">Soyad</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="lastName"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="lastName" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row">
        <label className="form-label required mb-3">E-posta</label>

        <Field
          type="email"
          className="form-control form-control-lg form-control-solid"
          name="email"
          value={currentEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setCurrentEmail(e.target.value ?? "")
            setFieldValue("email", e.target.value ?? "")

            if (emails && emails.includes(e.target.value)) {
              setEmailAlreadyExists(true)
            } else {
              setEmailAlreadyExists(false)
            }
          }}
        />
        {emailAlreadyExists ? (
          <div className="text-danger mt-2">
            Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.
          </div>
        ) : (
          <div className="text-danger mt-2">
            <ErrorMessage name="email" />
          </div>
        )}
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
