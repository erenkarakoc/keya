import { Response } from "../../../../../../_metronic/helpers"

export interface UserAddressModel {
  country: string
  state: string
  city: string
  addressLine: string
}

export type User = {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
  photoURL?: string | null
  phoneNumber?: string
  role?: string
  officeId: string
  permissions?: Array<number>
  address?: UserAddressModel
  createdAt: string
  lastLoginAt: string
  searchIndexEmail: string
  searchIndexName: string
}

export type UsersQueryResponse = Response<Array<User>>
