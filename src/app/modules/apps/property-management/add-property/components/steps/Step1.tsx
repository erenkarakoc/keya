/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useRef } from "react"

import { ErrorMessage, Field } from "formik"

import CurrencyInput from "react-currency-input-field"

import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface Step1Props {
  currentPrice: any
  setCurrentPrice: any
  description: any,
  setDescription: any,
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
}

const Step1: FC<Step1Props> = ({ currentPrice, setCurrentPrice, description, setDescription, setFieldValue }) => {
 
  const ReactQuillRef = useRef(null)
  const ReactQuillModules = {
    toolbar: [
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  }

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Genel Bilgiler</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Genel ilan bilgilerini girin. İlana dair talimatları ilgili danışmana
          iletmeyi unutmayın.
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-12">
          <label className="form-label required mb-3">İlan Başlığı</label>

          <Field
            type="text"
            className="form-control form-control-lg form-control-solid"
            name="title"
            style={{ textTransform: "uppercase" }}
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="title" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-6">
          <label className="form-label required mb-3">İlan Fiyatı</label>
          <CurrencyInput
            name="propertyDetails.price"
            className="form-control form-control-lg form-control-solid"
            value={currentPrice}
            onValueChange={(value) => {
              const price = value ? value?.toString() : ""
              setCurrentPrice(price)
              setFieldValue("propertyDetails.price", price)
            }}
            intlConfig={{ locale: "tr-TR", currency: "TRY" }}
            style={{ fontSize: 18, fontWeight: 800 }}
          />

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.price" />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label required">Takasa Açık</label>

          <div className="d-flex gap-2">
            <label className="d-flex cursor-pointer">
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="radio"
                  name="propertyDetails.exchange"
                  id="exchangeTrue"
                  value="true"
                />
              </span>
              <span
                className="d-flex align-items-center me-2 ms-2"
                style={{ width: "fitContent" }}
              >
                <span className="d-flex flex-column">
                  <span className="fw-bolder text-gray-800 fs-5">Evet</span>
                </span>
              </span>
            </label>

            <label className="d-flex cursor-pointer">
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="radio"
                  name="propertyDetails.exchange"
                  id="exchangeFalse"
                  value="false"
                />
              </span>
              <span
                className="d-flex align-items-center me-2 ms-2"
                style={{ width: "fitContent" }}
              >
                <span className="d-flex flex-column">
                  <span className="fw-bolder text-gray-800 fs-5">Hayır</span>
                </span>
              </span>
            </label>
          </div>

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.exchange" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-6">
          <label className="form-label required mb-3">Gayrimenkul Türü</label>
          <Field
            as="select"
            className="form-select form-select-lg form-select-solid"
            name="propertyDetails.type"
          >
            <option></option>
            <option value="residence">Konut</option>
            <option value="land">Arsa</option>
            <option value="office">İş Yeri</option>
            <option value="project">Proje</option>
          </Field>

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.type" />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label required mb-3">İlan Türü</label>
          <Field
            as="select"
            className="form-select form-select-lg form-select-solid"
            name="propertyDetails.for"
          >
            <option></option>
            <option value="sale">Satılık</option>
            <option value="rent">Kiralık</option>
            <option value="lease-sale">Devren Satılık</option>
            <option value="lease-rent">Devren Kiralık</option>
          </Field>

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.for" />
          </div>
        </div>
      </div>

      <div className="mb-10 fv-row row">
        <div className="col-md-12">
          <label className="form-label required mb-3">İlan Açıklaması</label>
          <ReactQuill
            ref={ReactQuillRef}
            theme="snow"
            value={description}
            modules={ReactQuillModules}
            onChange={(e) => {
              setDescription(e)
              setFieldValue("propertyDetails.description", e)
            }}
            className="custom-quill"
          />

          <input
            type="hidden"
            value={description}
            name="propertyDetails.description"
          />

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.description" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step1 }
