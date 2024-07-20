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
import { Property } from "../../../modules/apps/property-management/_core/_models"

type Props = {
  className: string
  users: User[]
  offices: Office[] | undefined
  properties: Property[] | undefined
}

const DashboardAgentsTable: React.FC<Props> = ({
  users,
  offices,
  properties,
  className,
}) => {
  const [sortedUsers, setSortedUsers] = useState<User[]>([])
  const [sortField, setSortField] = useState<
    "profitAmount" | "transactionCount" | "propertyCount" | null
  >(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const [thisMonthsTransactions, setThisMonthsTransactions] = useState<
    Transaction[]
  >([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)

  const calculateTotalTransaction = (userId: string) => {
    if (thisMonthsTransactions) {
      const userTransactions = thisMonthsTransactions.filter((transaction) =>
        transaction.userIds.map((id) => id.trim()).includes(userId.trim())
      )

      const totalAgentProfit = userTransactions.reduce((total, transaction) => {
        return total + Number(transaction.agentProfit)
      }, 0)

      if (userId === "f5DynkgPiedUAOaGPK8YqUJj4qC3")
        console.log(userTransactions)

      return totalAgentProfit
    }
    return 0
  }

  const calculatePropertiesLength = (userId: string) => {
    if (properties) {
      const userProperties = properties.filter((property) =>
        property.userIds.includes(userId)
      )
      return userProperties.length
    }
    return 0
  }

  const sortUsers = (
    sortBy: "profitAmount" | "transactionCount" | "propertyCount"
  ) => {
    const newSortOrder =
      sortField === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "desc"

    setSortField(sortBy)
    setSortOrder(newSortOrder)

    const sortedArr = [...users].filter(
      (user) => calculateTotalTransaction(user.id) > 0
    )

    const compare = (a: User, b: User) => {
      let totalA: number, totalB: number

      if (sortBy === "profitAmount") {
        totalA = calculateTotalTransaction(a.id) || 0
        totalB = calculateTotalTransaction(b.id) || 0
      } else if (sortBy === "transactionCount") {
        const userTransactionsA = thisMonthsTransactions.filter((transaction) =>
          transaction.userIds.map((id) => id.trim()).includes(a.id.trim())
        )
        const userTransactionsB = thisMonthsTransactions.filter((transaction) =>
          transaction.userIds.map((id) => id.trim()).includes(b.id.trim())
        )
        totalA = userTransactionsA.length || 0
        totalB = userTransactionsB.length || 0
      } else if (sortBy === "propertyCount") {
        if (properties) {
          const userPropertiesA = properties.filter((property) =>
            property.userIds.includes(a.id)
          )
          const userPropertiesB = properties.filter((property) =>
            property.userIds.includes(b.id)
          )
          totalA = userPropertiesA.length || 0
          totalB = userPropertiesB.length || 0
        } else {
          totalA = totalB = 0
        }
      } else {
        return 0
      }

      return newSortOrder === "asc" ? totalA - totalB : totalB - totalA
    }

    sortedArr.sort(compare)
    setSortedUsers(sortedArr)
  }

  useEffect(() => {
    const fetchThisMonthsTransactions = async () => {
      try {
        const transactionsArr: Transaction[] = await getThisMonthsTransactions()
        setThisMonthsTransactions(transactionsArr)
      } catch (error) {
        console.error("Failed to fetch transactions", error)
      } finally {
        setTransactionsLoading(false)
      }
    }

    fetchThisMonthsTransactions()
  }, [users])

  useEffect(() => {
    sortUsers("profitAmount")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisMonthsTransactions])

  return (
    <div className={`card ${className}`}>
      {!transactionsLoading ? (
        <>
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                Danışman İstatistikleri
              </span>
              {sortedUsers ? (
                <span className="text-muted mt-1 fw-semibold fs-7">
                  Toplam {users.length} / {sortedUsers.length} danışman gösteriliyor
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
                    <th
                      className="min-w-120px cursor-pointer user-select-none"
                      onClick={() => sortUsers("profitAmount")}
                    >
                      Bu Ayki Kazanç
                      {sortField === "profitAmount" &&
                        (sortOrder === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th
                      className="min-w-120px cursor-pointer user-select-none"
                      onClick={() => sortUsers("transactionCount")}
                    >
                      Bu Ayki İşlem
                      {sortField === "transactionCount" &&
                        (sortOrder === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th
                      className="min-w-100px text-end cursor-pointer user-select-none"
                      onClick={() => sortUsers("propertyCount")}
                    >
                      Portföy Sayısı
                      {sortField === "propertyCount" &&
                        (sortOrder === "asc" ? " ↑" : " ↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, i) => (
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
                      <td className="text-end">
                        <div className="d-flex flex-column w-100 me-2">
                          <div className="d-flex flex-stack mb-2">
                            <span className="text-muted me-2 fs-7 fw-semibold">
                              {
                                thisMonthsTransactions?.filter((transaction) =>
                                  transaction.userIds.includes(user.id)
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex flex-column w-100 me-2">
                          <div className="d-flex flex-end mb-2">
                            <span className="text-muted me-2 fs-7 fw-semibold">
                              {calculatePropertiesLength(user.id)}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
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
