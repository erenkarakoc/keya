import { FC, useEffect, useState } from "react"
import { formatPrice } from "../../../../_metronic/helpers/kyHelpers"
import { Transaction } from "../../../modules/apps/transactions-management/_core/_models"

type Props = {
  className: string
  thisMonthsTransactions: Transaction[] | undefined
}

const ThisMonth: FC<Props> = ({ className, thisMonthsTransactions }) => {
  const [officeProfit, setOfficeProfit] = useState(0)
  const [agentProfit, setAgentProfit] = useState(0)
  const [teamLeaderProfit, setTeamLeaderProfit] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    if (thisMonthsTransactions) {
      const calculateTransactions = async () => {
        setOfficeProfit(
          thisMonthsTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.officeProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
        setAgentProfit(
          thisMonthsTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.agentProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
        setTeamLeaderProfit(
          thisMonthsTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.teamLeaderProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
        setTotalProfit(
          thisMonthsTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.totalProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
      }

      calculateTransactions()
    }
  }, [thisMonthsTransactions])

  return (
    <div className={`card ${className}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex flex-column mb-7">
          <h4 className="text-gray-900 fw-bolder fs-3">Bu Ayki Kazanç</h4>
        </div>

        <div className="row g-0 mb-7">
          <div className="col">
            <div className="fs-6 text-gray-500">Ofis</div>
            <div className="fs-2 fw-bold text-gray-800">
              {officeProfit ? formatPrice(officeProfit.toString()) : "0₺"}
            </div>
          </div>

          <div className="col">
            <div className="fs-6 text-gray-500">Danışmanlar</div>
            <div className="fs-2 fw-bold text-gray-800">
              {agentProfit ? formatPrice(agentProfit.toString()) : "0₺"}
            </div>
          </div>
        </div>

        <div className="row g-0">
          <div className="col">
            <div className="fs-6 text-gray-500">Takım Liderleri</div>
            <div className="fs-2 fw-bold text-gray-800">
              {teamLeaderProfit
                ? formatPrice(teamLeaderProfit.toString())
                : "0₺"}
            </div>
          </div>

          <div className="col">
            <div className="fs-6 text-gray-500">Toplam Hizmet Bedeli</div>
            <div className="fs-2 fw-bold text-gray-800">
              {totalProfit ? formatPrice(totalProfit.toString()) : "0₺"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ThisMonth }
