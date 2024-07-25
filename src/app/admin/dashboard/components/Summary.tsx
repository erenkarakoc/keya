import { FC, useEffect, useState } from "react"
import { KTIcon } from "../../../../_metronic/helpers"
import { Transaction } from "../../../modules/apps/transactions-management/_core/_models"
import { formatPriceToShort } from "../../../../_metronic/helpers/kyHelpers"

type Props = {
  className: string
  backGroundColor: string
  transactions: Transaction[] | undefined
  propertiesLength: number | undefined
  usersLength: number | undefined
}

const Summary: FC<Props> = ({
  className,
  backGroundColor,
  transactions,
  propertiesLength,
  usersLength,
}) => {
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    if (transactions) {
      console.log(transactions)
      const calculateTransactions = async () => {
        setTotalProfit(
          transactions.reduce((sum, item) => {
            const profit = parseFloat(item.totalProfit)
            return sum + (isNaN(profit) ? 0 : profit)
          }, 0)
        )
      }

      calculateTransactions()
    }
  }, [transactions])

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{ backgroundColor: backGroundColor }}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex flex-column mb-7">
          <a
            href="#"
            className="text-gray-900 text-hover-primary fw-bolder fs-3"
          >
            Özet
          </a>
        </div>

        <div className="row g-0">
          <div className="col-6">
            <div className="d-flex align-items-center mb-9 me-2">
              <div className="symbol symbol-40px me-3">
                <div className="symbol-label bg-body bg-opacity-50">
                  <KTIcon
                    iconName="bill"
                    className="fs-1 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="fs-5 text-gray-900 fw-bolder lh-1">
                  {formatPriceToShort(totalProfit.toString())}
                </div>
                <div className="fs-7 text-gray-600 fw-bold">Toplam Gelir</div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="d-flex align-items-center mb-9 ms-2">
              <div className="symbol symbol-40px me-3">
                <div className="symbol-label bg-body bg-opacity-50">
                  <KTIcon
                    iconName="shop"
                    className="fs-1 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="fs-5 text-gray-900 fw-bolder lh-1">
                  {propertiesLength}
                </div>
                <div className="fs-7 text-gray-600 fw-bold">Portföy</div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="d-flex align-items-center me-2">
              <div className="symbol symbol-40px me-3">
                <div className="symbol-label bg-body bg-opacity-50">
                  <KTIcon
                    iconName="profile-user"
                    className="fs-1 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="fs-5 text-gray-900 fw-bolder lh-1">
                  {usersLength}
                </div>
                <div className="fs-7 text-gray-600 fw-bold">Danışman</div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="d-flex align-items-center ms-2">
              <div className="symbol symbol-40px me-3">
                <div className="symbol-label bg-body bg-opacity-50">
                  <KTIcon
                    iconName="feather"
                    className="fs-1 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="fs-5 text-gray-900 fw-bolder lh-1">
                  {transactions?.length}
                </div>
                <div className="fs-7 text-gray-600 fw-bold">İşlem</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Summary }
