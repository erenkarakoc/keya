import { Response } from "../../../../../_metronic/helpers"

export type Transaction = {
  id?: string
  userIds: string[]
  officeId: string
  propertyId: string
  customerName: string
  soldPrice: string
  agentProfit: string
  officeProfit: string
  totalProfit: string
  teamLeaderProfit: string
  percentage: string
  agentGotPaid: string
  informationForm: string
  otherExpenses: string
  createdAt: string
}

export type EmployerTransaction = {
  id?: string
  title: string
  userId: string[]
  officeId: string
  amount: string
  payout: boolean
  createdAt: string
}

export type OfficeTransaction = {
  id?: string
  title: string
  officeId: string
  amount: string
  payout: boolean
  createdAt: string
}

export type TransactionsQueryResponse = Response<Array<Transaction>>
