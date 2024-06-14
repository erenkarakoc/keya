import * as Yup from "yup"

export type ICreateAccount = {
  email: string
  firstName: string
  lastName: string
  password: string
  confirmpassword: string
  photoURL: string
  phoneNumber: string
  officeId: string
  role: string
  country?: number
  state?: number
  city?: number
  addressLine?: string
}

const step0Schema = Yup.object({
  accountType: Yup.string(),
})

const step1Schema = Yup.object({
  firstName: Yup.string()
    .min(3, "Ad en az 3 karakterden oluşmalı")
    .max(50, "Ad en fazla 50 karakterden oluşmalı")
    .required("Ad alanı zorunludur"),
  lastName: Yup.string()
    .min(3, "Soyad en az 3 karakterden oluşmalı")
    .max(50, "Soyad en fazla 50 karakterden oluşmalı")
    .required("Soyad alanı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi gir")
    .min(3, "E-posta en az 3 karakterden oluşmalı")
    .max(50, "E-posta en fazla 50 karakterden oluşmalı")
    .required("E-posta alanı zorunludur"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakterden oluşmalı")
    .max(50, "Şifre en fazla 50 karakterden oluşmalı")
    .required("Şifre alanı zorunludur"),
  confirmpassword: Yup.string()
    .min(6, "Şifre en az 6 karakterden oluşmalı")
    .max(50, "Şifre en fazla 50 karakterden oluşmalı")
    .required("Şifre tekrarı alanı zorunludur")
    .oneOf(
      [Yup.ref("password")],
      "Şifre ve şifre tekrarı alanları uyuşmalıdır"
    ),
})

const step2Schema = Yup.object({
  photoURL: Yup.string().required("Bir fotoğraf seçilmesi zorunludur"),
  phoneNumber: Yup.string()
    .matches(/^\+/, "Telefon numarası + işareti ile başlamalıdır")
    .required("Telefon numarası zorunludur"),
  country: Yup.number(),
  state: Yup.number(),
  city: Yup.number(),
  addressLine: Yup.string(),
})

const step3Schema = Yup.object({
  officeId: Yup.string().required("Bir ofis seçmek zorunludur"),
  role: Yup.string().required("Bir rol seçmek zorunludur"),
})
const step4Schema = Yup.object({
  empty: Yup.string(),
})

const inits: ICreateAccount = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmpassword: "",
  photoURL: "",
  phoneNumber: "",
  officeId: "",
  role: "",
  country: undefined,
  state: undefined,
  city: undefined,
  addressLine: "",
}

export {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  inits,
}
