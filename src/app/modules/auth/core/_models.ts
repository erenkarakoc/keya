export interface UserAddressModel {
  country: string
  state: string
  city: string
  addressLine: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export type UserModel = {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string
  photoURL?: string
  phoneNumber?: string
  officeId?: string
  role?: string
  permissions?: Array<number>
  address?: UserAddressModel
  createdAt: string
  lastLoginAt: string
  searchIndexEmail: string
  searchIndexName: string
}
