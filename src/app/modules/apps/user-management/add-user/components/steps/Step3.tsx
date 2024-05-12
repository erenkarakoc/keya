import React, { FC } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { ErrorMessage, Field } from "formik"

const Step3: FC = () => {
  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Rol ve Yetkiler</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Kullanıcının ofisinizde hangi role ve yetkilere sahip olacağını seçin.
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
