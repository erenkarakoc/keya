import { Response } from "../../../../../_metronic/helpers"

export type PropertyApplication = {
  id?: string
  firstName: string
  lastName: string
  phoneNumber: string
  for: "sale" | "rent" | ""
  type?: "residence" | "land" | "office" | "project" | "other"
  address: {
    country: string
    state: string
    city: string
  }
}

export type PropertyApplicationsQueryResponse = Response<
  Array<PropertyApplication>
>
