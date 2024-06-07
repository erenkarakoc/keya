import { FC, useState, useEffect } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { getUserById } from "../../../../user-management/_core/_requests"

interface Step5Props {
  values: {
    email?: string
    owners: string[]
  }
}

const Step5: FC<Step5Props> = ({ values }) => {
  const [brokerEmails, setBrokerEmails] = useState<string[]>([])

  useEffect(() => {
    const fetchBrokers = async (ids: string[]) => {
      const brokersArr: string[] = []

      ids.map(async (id) => {
        const brokers = await getUserById(id)
        brokersArr.push(brokers?.email as string)
      })

      setBrokerEmails(brokersArr)
    }

    fetchBrokers(values.owners)
  }, [values])

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
                  ? "İlan formunu başarıyla doldurdunuz. Kaydet butonuna basmadan önce gerekli talimatları Broker'lara e-posta aracılığıyla iletin:"
                  : "İlan formunu başarıyla doldurdunuz. Kaydet butonuna basmadan önce gerekli talimatları Broker'a e-posta aracılığıyla iletin:"}
                <br />
                <div className="d-flex flex-column">
                  {brokerEmails.map((email, i) => (
                    <a
                      href={`mailto:${email}`}
                      className="link-primary fw-bolder mt-2"
                      target="_blank"
                      key={i}
                    >
                      {email}
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
