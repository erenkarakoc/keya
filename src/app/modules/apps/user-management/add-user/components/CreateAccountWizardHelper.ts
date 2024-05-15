import * as Yup from "yup"

export type ICreateAccount = {
  email: string
  first_name: string
  last_name: string
  password: string
  confirmpassword: string
  photoURL: string
  phoneNumber: string
  role: string
  country?: string
  state?: string
  city?: string
  addressLine?: string
}

const step0Schema = Yup.object({
  accountType: Yup.string(),
})

const step1Schema = Yup.object({
  first_name: Yup.string()
    .min(3, "Ad en az 3 karakterden oluşmalı")
    .max(50, "Ad en fazla 50 karakterden oluşmalı")
    .required("Ad alanı zorunludur"),
  last_name: Yup.string()
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

// Step 2 Schema
const step2Schema = Yup.object({
  photoURL: Yup.string().required("Bir fotoğraf seçilmesi zorunludur"),
  phoneNumber: Yup.string()
    .min(17, "Telefon numarası 12 haneli şekilde girilmelidir")
    .max(17, "Telefon numarası 12 haneli şekilde girilmelidir")
    .matches(/^\+/, "Telefon numarası + işareti ile başlamalıdır")
    .required("Telefon numarası zorunludur"),
  country: Yup.string(),
  state: Yup.string(),
  city: Yup.string(),
  addressLine: Yup.string(),
})

// Step 3 Schema
const step3Schema = Yup.object({
  role: Yup.string().required("Bir rol seçmek zorunludur"),
})
const step4Schema = Yup.object({
  empty: Yup.string(),
})

const inits: ICreateAccount = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirmpassword: "",
  photoURL: "",
  phoneNumber: "",
  role: "",
  country: "",
  state: "",
  city: "",
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
