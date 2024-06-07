import { FC } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { Field } from "formik"

const Step0: FC = () => {
  return (
    <div className="w-100">
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
              <KTIcon iconName="document" className="fs-3x me-5" />

              <span className="d-block fw-bold text-start">
                <span className="text-gray-900 fw-bolder d-block fs-4 mb-2">
                  Bir ilan ekleyin
                </span>
                <span className="text-gray-500 fw-bold fs-6">
                  İlan oluşturma formunu kullanarak bir ilan ekleyin.
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
