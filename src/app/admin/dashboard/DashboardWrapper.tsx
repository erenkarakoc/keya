import { useEffect, useState } from "react"

import { EnableSidebar, PageTitle } from "../../../_metronic/layout/core"
import { useAuth } from "../../modules/auth/core/Auth"

import { DashboardAgentsTable } from "./components/DashboardAgentsTable"
import { DashboardPropertiesTable } from "./components/DashboardPropertiesTable"

import { getAllProperties } from "../../modules/apps/property-management/_core/_requests"
import { getAllUsers } from "../../modules/apps/user-management/_core/_requests"
import { getAllOffices } from "../../modules/apps/office-management/_core/_requests"
import { getAllTransactions } from "../../modules/apps/transactions-management/_core/_requests"

import { Property } from "../../modules/apps/property-management/_core/_models"
import { User } from "../../modules/apps/user-management/_core/_models"
import { Office } from "../../modules/apps/office-management/_core/_models"
import { Transaction } from "../../modules/apps/transactions-management/_core/_models"

import { IncomeSummary } from "./components/IncomeSummary"
import { MonthsSummary } from "./components/MonthSummary"
import { Summary } from "./components/Summary"

const DashboardPage = () => {
  const [properties, setProperties] = useState<Property[]>()
  const [users, setUsers] = useState<User[]>()
  const [offices, setOffices] = useState<Office[]>()
  const [transactions, setTransactions] = useState<Transaction[]>()

  useEffect(() => {
    const fetchProperties = async () => {
      const propertiesArr: Property[] = await getAllProperties()
      if (propertiesArr) setProperties(propertiesArr)
    }

    const fetchUsers = async () => {
      const usersArr: User[] = await getAllUsers()
      if (usersArr) setUsers(usersArr)
    }

    const fetchOffices = async () => {
      const officesArr: Office[] = await getAllOffices()
      if (officesArr) setOffices(officesArr)
    }

    const fetchTransactions = async () => {
      const transactionsArr: Transaction[] = await getAllTransactions()
      if (transactionsArr) setTransactions(transactionsArr)
    }

    fetchProperties()
    fetchUsers()
    fetchOffices()
    fetchTransactions()
  }, [])

  return (
    <>
      <div className="row gy-5 g-xl-10">
        <div className="col-xl-4">
          <IncomeSummary
            className="card-xl-stretch mb-xl-10"
            transactions={transactions}
          />
        </div>

        <div className="col-xl-4">
          <MonthsSummary
            className="card-xl-stretch mb-xl-10"
            backGroundColor="#F7D9E3"
            chartHeight="100px"
            transactions={transactions}
          />
        </div>

        <div className="col-xl-4">
          <Summary
            className="card-xl-stretch mb-xl-10"
            backGroundColor="#CBD4F4"
            transactions={transactions}
            propertiesLength={properties?.length}
            usersLength={users?.filter((user) => user.role === "agent").length}
          />
        </div>
      </div>

      {users && (
        <DashboardAgentsTable
          className="mb-5 mb-xl-10"
          users={users}
          offices={offices}
          properties={properties}
        />
      )}
      {properties && (
        <DashboardPropertiesTable
          className="mb-5 mb-xl-10"
          properties={properties}
          users={users}
          offices={offices}
        />
      )}
    </>
  )
}

const DashboardWrapper = () => {
  const { currentUser } = useAuth()

  return (
    <EnableSidebar>
      <PageTitle description="" breadcrumbs={[]}>
        {currentUser && "Merhaba " + currentUser?.firstName}
      </PageTitle>

      <DashboardPage />
    </EnableSidebar>
  )
}

export { DashboardWrapper }
