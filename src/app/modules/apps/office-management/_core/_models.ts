import { Response } from "../../../../../_metronic/helpers"

export type Office = {
  id: string
  name: string
  about: string
  owners: string[]
  email?: string
  phoneNumber: string
  country?: string
  state?: string
  city?: string
  addressLine?: string
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
