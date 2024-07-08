import { Response } from "../../../../../_metronic/helpers"

export type FranchiseApplication = {
  id?: string
  firstName: string
  lastName: string
  phoneNumber: string
  occupation: string
  address: {
    country: string
    state: string
  }
}

export type FranchiseApplicationsQueryResponse = Response<
  Array<FranchiseApplication>
>
