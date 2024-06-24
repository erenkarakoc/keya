import { Response } from "../../../../../_metronic/helpers"

export type Office = {
  id: string
  name: string
  about: {
    title: string
    description: string
  }
  owners: string[]
  email?: string
  phoneNumber: string
  address: {
    country?: string
    state?: string
    city?: string
    addressLine?: string
  }
  instagram?: string
  twitter?: string
  facebook?: string
  whatsapp?: string
  linkedin?: string
  youtube?: string
  website?: string
  photoURLs: string[]
  users?: string[]
}

export type OfficesQueryResponse = Response<Array<Office>>
