import * as Yup from "yup"
// import { getAllOffices } from "../../offices-list/core/_requests"
// import { slugify } from "../../../../../../_metronic/helpers/kyHelpers"

const urlRegex =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/

export type ICreateAccount = {
  name: string
  about: {
    title: string
    description: string
  }
  owners: []
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
  photoURLs: []
  users?: []
}

const step0Schema = Yup.object({
  accountType: Yup.string(),
})

const step1Schema = Yup.object({
  name: Yup.string()
    .max(50, "Ofis adı en fazla 50 karakterden oluşmalı.")
    .required("Ofis adı alanı zorunludur."),
  about: Yup.object({
    title: Yup.string().required("Başlık alanı zorunludur."),
    description: Yup.string().required("Açıklama alanı zorunludur."),
  }),
  owners: Yup.array()
    .min(1, "En az bir Broker seçmek zorunludur.")
    .required("En az bir Broker seçmek zorunludur."),
})

const step2Schema = Yup.object({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi gir")
    .min(3, "E-posta en az 3 karakterden oluşmalı")
    .max(50, "E-posta en fazla 50 karakterden oluşmalı")
    .required("E-posta alanı zorunludur"),
  phoneNumber: Yup.string()
    .matches(/^\+/, "Telefon numarası + işareti ile başlamalıdır.")
    .required("Telefon numarası zorunludur."),
  address: Yup.object({
    country: Yup.string().required("Ülke alanı zorunludur"),
    state: Yup.string().required("İl alanı zorunludur"),
    city: Yup.string().required("İlçe alanı zorunludur"),
    addressLine: Yup.string(),
  }),
  instagram: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
  twitter: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
  facebook: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
  whatsapp: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
  youtube: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
  linkedin: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
  website: Yup.string().matches(urlRegex, "Lütfen geçerli bir link girin."),
})

const step3Schema = Yup.object({
  photoURLs: Yup.array()
    .min(1, "En az bir fotoğraf seçilmesi zorunludur.")
    .required("En az bir fotoğraf seçilmesi zorunludur."),
})

const step4Schema = Yup.object({
  users: Yup.array(),
})

const step5Schema = Yup.object({
  empty: Yup.string(),
})

const inits: ICreateAccount = {
  name: "",
  about: {
    title: "",
    description: "",
  },
  owners: [],
  email: "",
  phoneNumber: "",
  address: {
    country: undefined,
    state: undefined,
    city: undefined,
    addressLine: "",
  },
  instagram: "",
  twitter: "",
  facebook: "",
  whatsapp: "",
  linkedin: "",
  youtube: "",
  website: "",
  photoURLs: [],
  users: [],
}

export {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  inits,
}
