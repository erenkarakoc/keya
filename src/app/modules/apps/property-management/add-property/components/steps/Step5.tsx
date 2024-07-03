/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent } from "react"
import { Link } from "react-router-dom"

import { Field, ErrorMessage } from "formik"
import { AsYouType } from "libphonenumber-js"

import MultiSelect from "../../../../components/multiselect/MultiSelect"
import { getUserRoleText } from "../../../../../../../_metronic/helpers/kyHelpers"
import { getAllUsers } from "../../../../user-management/_core/_requests"

import CurrencyInput from "react-currency-input-field"

interface Step5Props {
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
}

const Step5: FC<Step5Props> = ({ setFieldValue }) => {
  const [users, setUsers] = useState<{ id: string; label: string }[]>([])
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(
    "+90"
  )
  const [countryCode, setCountryCode] = useState<string | null>("TR")
  const [currentPermitUntilDate, setCurrentPermitUntilDate] = useState("")
  const [isPermitUntilHidden, setIsPermitUntilHidden] = useState(false)

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const asYouType = new AsYouType()
    const formatted = asYouType.input(e.target.value)
    const countryCode = asYouType.getNumber()?.country

    setCurrentPhoneNumber(formatted)
    setFieldValue("ownerDetails.ownerPhoneNumber", formatted)
    setCountryCode(countryCode ? countryCode : "")
  }

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers()
      const usersArr = []

      if (allUsers) {
        usersArr.push(
          ...allUsers.map((user) => ({
            id: user.id,
            label:
              user.firstName +
              " " +
              user.lastName +
              " | " +
              getUserRoleText(user.role as string),
          }))
        )
      }

      setUsers(usersArr)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="w-100">
      <div className="pb-10">
        <h2 className="fw-bolder text-gray-900">Portföy</h2>
        <div className="text-gray-500 fw-bold fs-6">
          Portföye dair bilgileri girin.
        </div>
      </div>

      <div className="mb-0">
        <div className="fv-row mb-10">
          <label className="form-label required mb-3">
            Gayrimenkul Danışmanı
          </label>

          <MultiSelect
            options={users}
            id="userIds"
            name="userIds"
            notFoundText="Aramanızla eşleşen bir kullanıcı bulunamadı."
          />

          <div className="form-text">
            Lütfen portföy sahibi gayrimenkul danışmanlarını seçin. Eğer sisteme
            kayıtlı değilse{" "}
            <Link
              to="/arayuz/kullanici-yonetimi/kullanici-ekle"
              target="_blank"
            >
              Kullanıcı Ekle
            </Link>{" "}
            sayfasından kaydedebilirsiniz.
          </div>
          <div className="text-danger mt-2">
            <ErrorMessage name="userIds" />
          </div>
        </div>

        <div className="fv-row mb-10">
          <div className="col-md-12">
            <label className="form-label mb-3 required">
              Gayrimenkul Sahibinin Adı Soyadı
            </label>

            <Field
              type="text"
              className="form-control form-control-lg form-control-solid"
              name="ownerDetails.ownerFullName"
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="ownerDetails.ownerFullName" />
            </div>
          </div>
        </div>

        <div className="fv-row mb-10">
          <label className="form-label mb-3 required">
            Gayrimenkul Sahibinin Telefon Numarası
          </label>

          <div className="position-relative">
            <Field
              className="form-control form-control-lg form-control-solid"
              placeholder="+90 5xx xxx xx xx"
              onChange={handlePhoneNumberChange}
              value={currentPhoneNumber}
              style={{ paddingLeft: "40px" }}
              name="ownerDetails.ownerPhoneNumber"
            />
            <span
              className={`fi fi-${countryCode?.toLowerCase()} position-absolute`}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                left: "13px",
              }}
            ></span>
          </div>
          <div className="form-text">
            Lütfen numaranın başında ülke kodu bulundurun. Örn. +90
          </div>
          <div className="text-danger mt-2">
            <ErrorMessage name="ownerDetails.ownerPhoneNumber" />
          </div>
        </div>

        <div className="fv-row mb-10 row">
          <div className="col-md-6">
            <label className="form-label mb-3 required">Yetki Türü</label>
            <Field
              type="text"
              className="form-control form-control-lg form-control-solid"
              name="ownerDetails.permit"
            />

            <div className="form-text">
              Lütfen yetki türünü belirtin. Örn. Yetki belgesi imzalandı, mesaj
              aracılığıyla alındı.
            </div>
            <div className="text-danger mt-2">
              <ErrorMessage name="ownerDetails.permit" />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label required mb-3">Yetki Fiyatı</label>
            <CurrencyInput
              name="ownerDetails.permitPrice"
              className="form-control form-control-lg form-control-solid"
              allowDecimals={false}
              onValueChange={(value) => {
                const permitPrice = value ? value?.toString() : ""
                setFieldValue("ownerDetails.permitPrice", permitPrice)
              }}
              intlConfig={{ locale: "tr-TR", currency: "TRY" }}
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="ownerDetails.permitPrice" />
            </div>
          </div>
        </div>

        <div className="fv-row mb-10 row">
          <div className="col-md-6">
            <label className="form-label mb-3 required">
              Yetki Başlangıç Tarihi
            </label>
            <Field
              type="date"
              className="form-control form-control-lg form-control-solid"
              name="ownerDetails.permitDate"
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="ownerDetails.permitDate" />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label mb-3 required">
              Yetki Bitiş Tarihi
            </label>
            <Field
              type="date"
              className={`form-control form-control-lg form-control-solid${
                isPermitUntilHidden ? " d-none" : ""
              }`}
              value={currentPermitUntilDate}
              onChange={(e: any) => {
                setFieldValue("ownerDetails.permitUntilDate", e.target.value)
                setCurrentPermitUntilDate(e.target.value)
              }}
              name="ownerDetails.permitUntilDate"
            />

            <div
              className={`form-control form-control-lg form-control-solid${
                !isPermitUntilHidden ? " d-none" : ""
              }`}
            >
              Süresiz
            </div>

            <span
              className="cursor-pointer text-gray-600"
              onClick={() => {
                if (isPermitUntilHidden) {
                  setFieldValue(
                    "ownerDetails.permitUntilDate",
                    currentPermitUntilDate
                  )
                  setIsPermitUntilHidden(false)
                } else {
                  setFieldValue("ownerDetails.permitUntilDate", "limitless")
                  setIsPermitUntilHidden(true)
                }
              }}
            >
              <u>{isPermitUntilHidden ? "Süresiz Değil" : "Süresiz"}</u>
            </span>

            <div className="text-danger mt-2">
              <ErrorMessage name="ownerDetails.permitUntilDate" />
            </div>
          </div>
        </div>

        <div className="fv-row mb-10 row">
          <label className="form-label fs-4  mb-5">İlan Numaraları</label>
          <div className="col-md-4">
            <label className="form-label mb-3">Sahibinden</label>
            <Field
              type="text"
              className="form-control form-control-lg form-control-solid"
              name="sahibindenNo"
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="sahibindenNo" />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label mb-3">Emlakjet</label>
            <Field
              type="text"
              className="form-control form-control-lg form-control-solid"
              name="emlakJetNo"
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="emlakJetNo" />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label mb-3">Hepsiemlak</label>
            <Field
              type="text"
              className="form-control form-control-lg form-control-solid"
              name="hepsiEmlakNo"
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="hepsiEmlakNo" />
            </div>
          </div>
        </div>

        <div className="fv-row mb-10 row">
          <div className="col-md-12">
            <label className="form-label mb-3">İlan Notu</label>
            <Field
              as="textarea"
              className="form-control form-control-lg form-control-solid"
              name="personalDescription"
            />

            <div className="text-danger mt-2">
              <ErrorMessage name="personalDescription" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step5 }
