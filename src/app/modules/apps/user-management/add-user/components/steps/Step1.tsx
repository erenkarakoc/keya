/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, FC, useEffect, useState } from "react"
import { ErrorMessage, Field } from "formik"
import { getUserEmails } from "../../../_core/_requests"
import { slugify } from "../../../../../../../_metronic/helpers/kyHelpers"

interface Step1Props {
  values: any
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
  emailAlreadyExists: boolean
  setEmailAlreadyExists: any
}

const Step1: FC<Step1Props> = ({
  values,
  setFieldValue,
  emailAlreadyExists,
  setEmailAlreadyExists,
}) => {
  const [currentEmail, setCurrentEmail] = useState("")
  const [emails, setEmails] = useState<string[]>()
  const [currentIdNo, setCurrentIdNo] = useState("")

  const checkEmailAlreadyExists = (email: string) => {
    if (emails && emails.includes(email)) {
      setEmailAlreadyExists(true)
    } else {
      setEmailAlreadyExists(false)
    }
  }

  useEffect(() => {
    const fetchEmails = async () => setEmails(await getUserEmails())

    fetchEmails()
  }, [])

  useEffect(() => {
    const setEmailFromName = () => {
      if (values.firstName && values.lastName) {
        const emailFromName =
          slugify(values.firstName + values.lastName) + "@keya.com.tr"

        setFieldValue("email", emailFromName)
        setCurrentEmail(emailFromName)

        checkEmailAlreadyExists(emailFromName)
      }
    }

    setEmailFromName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.firstName, values.lastName])

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
        <label className="form-label mb-3">
          T.C. Kimlik No/Yabancı Kimlik No
        </label>

        <Field
          type="text"
          className="form-control form-control-lg form-control-solid"
          name="tc"
          value={currentIdNo}
          onChange={(e: any) => {
            e.preventDefault()
            const value = e.target.value

            if (/^\d*$/.test(value)) {
              setCurrentIdNo(value)
              setFieldValue("tc", value)
              setFieldValue("password", value)
              setFieldValue("confirmpassword", value)
            }
          }}
        />
        <div className="text-danger mt-2">
          <ErrorMessage name="tc" />
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

            checkEmailAlreadyExists(e.target.value)
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
