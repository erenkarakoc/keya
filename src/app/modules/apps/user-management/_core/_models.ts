import { Response } from "../../../../../_metronic/helpers"

export type User = {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
  photoURL?: string | null
  phoneNumber?: string
  role: string
  officeId: string
  searchIndexEmail: string
  searchIndexName: string
  about?: {
    title?: string
    description?: string
  }
  address?: {
    country?: string
    state?: string
    city?: string
    addressLine?: string
  }
  createdAt: string
  lastLoginAt: string
}

export type UsersQueryResponse = Response<Array<User>>
