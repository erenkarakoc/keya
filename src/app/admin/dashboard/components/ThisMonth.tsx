import { FC, useEffect, useState } from "react"
import { formatPrice } from "../../../../_metronic/helpers/kyHelpers"
import { Transaction } from "../../../modules/apps/transactions-management/_core/_models"

type Props = {
  className: string
  transactions: Transaction[] | undefined
}

const ThisMonth: FC<Props> = ({ className, transactions }) => {
  const [officeProfit, setOfficeProfit] = useState(0)
  const [agentProfit, setAgentProfit] = useState(0)
  const [teamLeaderProfit, setTeamLeaderProfit] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    if (transactions) {
      const calculateTransactions = async () => {
        const now = new Date()
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        const parseDate = (dateString: string) => new Date(dateString)

        const thisMonthTransactions = transactions.filter((transaction) => {
          const transactionDate = parseDate(transaction.createdAt)
          return transactionDate >= thisMonthStart && transactionDate < now
        })

        setOfficeProfit(
          thisMonthTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.officeProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
        setAgentProfit(
          thisMonthTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.agentProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
        setTeamLeaderProfit(
          thisMonthTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.teamLeaderProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
        setTotalProfit(
          thisMonthTransactions.reduce((sum, item) => {
            const profit = parseFloat(item.totalProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
      }

      calculateTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

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
              {officeProfit ? formatPrice(officeProfit.toString()) : 0}
            </div>
          </div>

          <div className="col">
            <div className="fs-6 text-gray-500">Danışmanlar</div>
            <div className="fs-2 fw-bold text-gray-800">
              {agentProfit ? formatPrice(agentProfit.toString()) : 0}
            </div>
          </div>
        </div>

        <div className="row g-0">
          <div className="col">
            <div className="fs-6 text-gray-500">Takım Liderleri</div>
            <div className="fs-2 fw-bold text-gray-800">
              {teamLeaderProfit ? formatPrice(teamLeaderProfit.toString()) : 0}
            </div>
          </div>

          <div className="col">
            <div className="fs-6 text-gray-500">Toplam Hizmet Bedeli</div>
            <div className="fs-2 fw-bold text-gray-800">
              {totalProfit ? formatPrice(totalProfit.toString()) : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ThisMonth }
