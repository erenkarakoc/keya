import { FC } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { Field } from "formik"

const Step0: FC = () => {
  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder d-flex align-items-center text-gray-900">
          Bir kullanıcı ekleyin
          <i
            className="fas fa-exclamation-circle ms-2 fs-7"
            data-bs-toggle="tooltip"
            title="Ekleyeceğiniz kullanıcı farklı yetkilere sahip olacaktır. Lütfen kullanıcıyı yetkilendirirken dikkatli seçim yapınız."
          ></i>
        </h2>

        <div className="text-gray-500 fw-bold fs-6">
          Kullanıcı oluşturma formunu kullanarak bir kullanıcı ekleyin.
        </div>
      </div>

      <div className="fv-row">
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <Field
              type="radio"
              className="btn-check"
              name="accountType"
              value="personal"
              checked={true}
              id="kt_create_account_form_account_type_personal"
            />
            <label
              style={{ userSelect: "initial", cursor: "default" }}
              className="btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10"
              htmlFor="kt_create_account_form_account_type_personal"
            >
              <KTIcon iconName="badge" className="fs-3x me-5" />

              <span className="d-block fw-bold text-start">
                <span className="text-gray-900 fw-bolder d-block fs-4 mb-2">
                  Kullanıcı hesabı
                </span>
                <span className="text-gray-500 fw-bold fs-6">
                  Gayrimenkul danışmanı, ofis asistanı vb. gibi kullanıcılar.
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step0 }
