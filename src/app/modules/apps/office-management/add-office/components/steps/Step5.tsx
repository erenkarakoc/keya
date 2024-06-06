import { FC } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"

interface Step5Props {
  values: {
    email?: string
    owners: []
  }
}

const Step5: FC<Step5Props> = ({ values }) => {
  return (
    <div className="w-100">
      <div className="mb-0">
        <div className="notice d-flex bg-light rounded border-primary border border-dashed p-6">
          <KTIcon iconName="badge" className="fs-2tx text-primary me-4" />
          <div className="d-flex flex-stack flex-grow-1">
            <div className="fw-bold">
              <h4 className="text-gray-800 fw-bolder">Son bir adım!</h4>
              <div className="fs-6 text-gray-600">
                {values.owners.length > 1
                  ? "Ofis formunu başarıyla doldurdunuz. Kaydet butonuna basmadan önce gerekli talimatları Broker'lara e-posta aracılığıyla iletin:"
                  : "Ofis formunu başarıyla doldurdunuz. Kaydet butonuna basmadan önce gerekli talimatları Broker'a e-posta aracılığıyla iletin:"}
                <br />
                <div className="d-flex flex-column">
                  {values.owners.map((owner: string, i) => (
                    <a
                      href={`mailto:${values.email}`}
                      className="link-primary fw-bolder mt-2"
                      target="_blank"
                      key={i}
                    >
                      {values.email}
                    </a>
                  ))}
                </div>
              </div>
              <input type="hidden" name="empty" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step5 }
