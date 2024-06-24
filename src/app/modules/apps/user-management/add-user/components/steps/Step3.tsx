import React, { FC, useState, useEffect, ChangeEvent } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { ErrorMessage, Field } from "formik"
import { getAllOffices } from "../../../../office-management/_core/_requests"

interface Office {
  id: string
  name: string
}

interface Step3Props {
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
}

const Step3: FC<Step3Props> = ({ setFieldValue }) => {
  const [offices, setOffices] = useState<Office[]>()
  const [currentOffice, setCurrentOffice] = useState("")

  const handleOfficeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFieldValue("officeId", e.target.value)
    setCurrentOffice(e.target.value)
  }

  const fetchOffices = async () => {
    setOffices(await getAllOffices())
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Ofis ve Yetkiler</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Kullanıcının hangi ofiste olacağını ve hangi role sahip olacağını
          seçin.
        </div>
      </div>

      <div className="fv-row mb-10">
        <label className="form-label">Bağlı Olduğu Ofis</label>

        <Field
          as="select"
          className="form-select form-select-lg form-select-solid"
          onChange={handleOfficeChange}
          name="officeId"
          value={currentOffice}
        >
          <option></option>
          {offices &&
            offices.map((office) => (
              <option value={office.id} office-id={office.id} key={office.id}>
                {import.meta.env.VITE_APP_NAME} {office.name}
              </option>
            ))}
        </Field>

        <div className="text-danger mt-2">
            <ErrorMessage name="officeId" />
          </div>
      </div>

      <div className="mb-10 fv-row">
        <div className="mb-0">
          <label className="d-flex flex-stack mb-5 cursor-pointer">
            <span className="d-flex align-items-center me-2">
              <span className="symbol symbol-50px me-6">
                <span className="symbol-label">
                  <KTIcon iconName="bank" className="fs-1 text-gray-600" />
                </span>
              </span>

              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 text-hover-primary fs-5">
                  Yönetici
                </span>
                <span className="fs-6 fw-bold text-gray-500">Tüm yetkiler</span>
              </span>
            </span>

            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="radio"
                name="role"
                value="admin"
              />
            </span>
          </label>

          <label className="d-flex flex-stack mb-5 cursor-pointer">
            <span className="d-flex align-items-center me-2">
              <span className="symbol symbol-50px me-6">
                <span className="symbol-label">
                  <KTIcon iconName="bank" className="fs-1 text-gray-600" />
                </span>
              </span>

              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 text-hover-primary fs-5">
                  Broker
                </span>
                <span className="fs-6 fw-bold text-gray-500">
                  Franchise ofisi dahilinde tüm yetkiler
                </span>
              </span>
            </span>

            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="radio"
                name="role"
                value="broker"
              />
            </span>
          </label>

          <label className="d-flex flex-stack mb-5 cursor-pointer">
            <span className="d-flex align-items-center me-2">
              <span className="symbol symbol-50px me-6">
                <span className="symbol-label">
                  <KTIcon iconName="bank" className="fs-1 text-gray-600" />
                </span>
              </span>

              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 text-hover-primary fs-5">
                  Ofis Asistanı
                </span>
                <span className="fs-6 fw-bold text-gray-500">
                  Franchise ofisi dahilinde üst düzey yetkiler
                </span>
              </span>
            </span>

            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="radio"
                name="role"
                value="assistant"
              />
            </span>
          </label>

          <label className="d-flex flex-stack mb-5 cursor-pointer">
            <span className="d-flex align-items-center me-2">
              <span className="symbol symbol-50px me-6">
                <span className="symbol-label">
                  <KTIcon iconName="bank" className="fs-1 text-gray-600" />
                </span>
              </span>

              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 text-hover-primary fs-5">
                  İnsan Kaynakları
                </span>
                <span className="fs-6 fw-bold text-gray-500">
                  Danışmanlar ve personeller dahilinde yetkiler
                </span>
              </span>
            </span>

            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="radio"
                name="role"
                value="human-resources"
              />
            </span>
          </label>

          <label className="d-flex flex-stack mb-5 cursor-pointer">
            <span className="d-flex align-items-center me-2">
              <span className="symbol symbol-50px me-6">
                <span className="symbol-label">
                  <KTIcon iconName="bank" className="fs-1 text-gray-600" />
                </span>
              </span>

              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 text-hover-primary fs-5">
                  Franchise Yöneticisi
                </span>
                <span className="fs-6 fw-bold text-gray-500">
                  Franchise ofisler ve yeni broker adayları dahilinde yetkiler
                </span>
              </span>
            </span>

            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="radio"
                name="role"
                value="franchise-manager"
              />
            </span>
          </label>

          <label className="d-flex flex-stack mb-5 cursor-pointer">
            <span className="d-flex align-items-center me-2">
              <span className="symbol symbol-50px me-6">
                <span className="symbol-label">
                  <KTIcon iconName="bank" className="fs-1 text-gray-600" />
                </span>
              </span>

              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 text-hover-primary fs-5">
                  Gayrimenkul Danışmanı
                </span>
                <span className="fs-6 fw-bold text-gray-500">
                  Kendi portföyleri dahilinde yetkiler
                </span>
              </span>
            </span>

            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="radio"
                name="role"
                value="agent"
              />
            </span>
          </label>

          <div className="text-danger mt-2">
            <ErrorMessage name="role" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step3 }
