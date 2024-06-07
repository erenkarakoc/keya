import React, { FC, useEffect, useState } from "react"

import { ErrorMessage, Field } from "formik"

import MultiSelect from "./../../../../components/multiselect/MultiSelect"

import { getUsersByRole } from "../../../../user-management/_core/_requests"

const Step1: FC = () => {
  const [brokers, setBrokers] = useState<{ id: string; label: string }[]>([])

  const fetchBrokers = async () => {
    try {
      const response = await getUsersByRole("broker")
      if (response) {
        const brokersArr = response.map((user) => ({
          id: user.id,
          label: user.email,
        }))

        setBrokers(brokersArr)
      }
    } catch (error) {
      console.error("Error fetching brokers:", error)
    }
  }

  useEffect(() => {
    fetchBrokers()
  }, [])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Genel Bilgiler</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Genel ilan bilgilerini girin. İlanine dair talimatları
          Borker'a/Broker'lara iletmeyi unutmayın.
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-12">
          <label className="form-label required mb-3">İlan Adı</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="name"
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="name" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-12">
          <label className="form-label mb-3">İlan Hakkında</label>

          <Field
            as="textarea"
            className="form-control form-control-lg form-control-solid"
            data-kt-autosize="true"
            rows={4}
            name="about"
            placeholder="İlan hakkında bilgi..."
          ></Field>
          <div className="text-danger mt-2">
            <ErrorMessage name="about" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row">
        <label className="form-label required mb-3">
          Broker E-posta Adresi
        </label>

        <MultiSelect
          options={brokers}
          id="owners"
          name="owners"
          notFoundText="Aramanızla eşleşen bir Broker bulunamadı."
        />
        <div className="text-danger mt-2">
          <ErrorMessage name="owners" />
        </div>
        <div className="form-text">
          Lütfen Broker kullanıcısının/kullanıcılarının e-posta adresini
          ekleyin. Birden fazla e-posta adresini virgül ile ayırın.
        </div>
      </div>
    </div>
  )
}

export { Step1 }
