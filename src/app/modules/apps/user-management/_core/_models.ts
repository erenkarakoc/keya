import { Response } from "../../../../../_metronic/helpers"

export type User = {
  id: string
  uid: string
  tc: string
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
  ref: string
  joinedAt: string
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export type UsersQueryResponse = Response<Array<User>>
