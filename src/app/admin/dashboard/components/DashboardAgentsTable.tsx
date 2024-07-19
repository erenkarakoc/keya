import React, { useEffect, useState } from "react"
import { KTIcon } from "../../../../_metronic/helpers"

import { User } from "../../../modules/apps/user-management/_core/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"

import {
  formatPrice,
  getUserRoleText,
} from "../../../../_metronic/helpers/kyHelpers"
import { KYOfficeImage } from "../../../frontend/components/KYOfficeImage/KYOfficeImage"

import { Transaction } from "../../../modules/apps/transactions-management/_core/_models"
import { getThisMonthsTransactions } from "../../../modules/apps/transactions-management/_core/_requests"

type Props = {
  className: string
  users: User[]
  offices: Office[] | undefined
}

const DashboardAgentsTable: React.FC<Props> = ({
  users,
  offices,
  className,
}) => {
  const [sortedUsers, setSortedUsers] = useState<User[]>()
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>()

  const calculateTotalTransaction = (userId: string) => {
    let currentTransaction: Transaction | undefined = undefined

    if (transactions?.length) {
      currentTransaction = transactions.find((transaction) =>
        transaction.userIds.includes(userId)
      )
    }

    if (!currentTransaction) {
      return 0
    }

    console.log(currentTransaction.createdAt)

    return Number(currentTransaction.agentProfit)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsArr: Transaction[] = await getThisMonthsTransactions()
      setTransactions(transactionsArr)
      setTransactionsLoading(false)
    }

    fetchTransactions()
  }, [users])

  useEffect(() => {
    const sortedArr = [...users]
      .filter((user) => calculateTotalTransaction(user.id) > 0)
      .sort((a, b) => {
        const totalA = calculateTotalTransaction(a.id) || 0
        const totalB = calculateTotalTransaction(b.id) || 0
        return totalB - totalA
      })

    setSortedUsers(sortedArr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return (
    <div className={`card ${className}`}>
      {!transactionsLoading ? (
        <>
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                Danışman İstatistikleri
              </span>
              {users ? (
                <span className="text-muted mt-1 fw-semibold fs-7">
                  Toplam {sortedUsers?.length} Danışman
                </span>
              ) : (
                ""
              )}
            </h3>
            <div
              className="card-toolbar"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-trigger="hover"
              title="Click to add a user"
            >
              <a
                href="/arayuz/kullanici-yonetimi/kullanici-ekle"
                className="btn btn-sm btn-light-primary"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_invite_friends"
              >
                <KTIcon iconName="plus" className="fs-3" />
                Yeni Danışman
              </a>
            </div>
          </div>
          <div className="card-body py-3">
            <div className="table-responsive">
              <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr className="fw-bold text-muted">
                    <th className="min-w-150px">Danışman</th>
                    {offices && <th className="min-w-140px">Ofis</th>}
                    <th className="min-w-120px">Bu Ayki Kazanç</th>
                    <th className="min-w-100px text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers
                    ? sortedUsers.map((user, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="symbol symbol-45px me-5">
                                  <img
                                    src={user.photoURL ?? ""}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                                <div className="d-flex justify-content-start flex-column">
                                  <a
                                    href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                                    target="_blank"
                                    className="text-gray-900 fw-bold text-hover-primary fs-6"
                                  >
                                    {user.firstName} {user.lastName}
                                  </a>
                                  <span className="text-muted fw-semibold text-muted d-block fs-7">
                                    {getUserRoleText(user.role)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            {offices && (
                              <td>
                                {offices
                                  .filter((office) =>
                                    user.officeId.includes(office.id)
                                  )
                                  .map((office) => (
                                    <a
                                      href={`/arayuz/ofis-detayi/${office.id}/genel`}
                                      target="_blank"
                                      className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                                      key={office.id}
                                    >
                                      <KYOfficeImage
                                        officeName={office.name}
                                        height={50}
                                        width={50}
                                      />
                                    </a>
                                  ))}
                              </td>
                            )}
                            <td className="text-end">
                              <div className="d-flex flex-column w-100 me-2">
                                <div className="d-flex flex-stack mb-2">
                                  <span className="text-muted me-2 fs-7 fw-semibold">
                                    {calculateTotalTransaction(user.id)
                                      ? formatPrice(
                                          calculateTotalTransaction(
                                            user.id
                                          ).toString()
                                        )
                                      : "Satış yok"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end flex-shrink-0">
                                <a
                                  href="#"
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                >
                                  <KTIcon iconName="switch" className="fs-3" />
                                </a>
                                <a
                                  href="#"
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                >
                                  <KTIcon iconName="pencil" className="fs-3" />
                                </a>
                                <a
                                  href="#"
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                >
                                  <KTIcon iconName="trash" className="fs-3" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    : ""}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
          <span className="spinner-border spinner-border-lg"></span>
        </div>
      )}
    </div>
  )
}

export { DashboardAgentsTable }
