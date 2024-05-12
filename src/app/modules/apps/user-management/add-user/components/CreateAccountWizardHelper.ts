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

const createAccountSchemas = [
  Yup.object({
    accountType: Yup.string(),
  }),
  Yup.object({
    first_name: Yup.string()
      .min(3, "Ad en az 3 karakterden oluşmalı")
      .max(50, "Ad en fazla 50 karakterden oluşmalı")
      .required("Ad alanı zorunludur"),
  }),
  Yup.object({
    last_name: Yup.string()
      .min(3, "Soyad en az 3 karakterden oluşmalı")
      .max(50, "Soyad en fazla 50 karakterden oluşmalı")
      .required("Soyad alanı zorunludur"),
  }),
  Yup.object({
    email: Yup.string()
      .email("Geçerli bir e-posta adresi gir")
      .min(3, "E-posta en az 3 karakterden oluşmalı")
      .max(50, "E-posta en fazla 50 karakterden oluşmalı")
      .required("E-posta alanı zorunludur"),
  }),
  Yup.object({
    password: Yup.string()
      .min(3, "Şifre en az 3 karakterden oluşmalı")
      .max(50, "Şifre en fazla 50 karakterden oluşmalı")
      .required("Şifre alanı zorunludur"),
  }),
  Yup.object({
    confirmpassword: Yup.string()
      .min(3, "Şifre en az 3 karakterden oluşmalı")
      .max(50, "Şifre en fazla 50 karakterden oluşmalı")
      .required("Şifre tekrarı alanı zorunludur")
      .oneOf(
        [Yup.ref("password")],
        "Şifre ve şifre tekrarı alanları uyuşmalıdır"
      ),
  }),
  Yup.object({
    phoneNumber: Yup.string()
      .min(10, "Telefon numarası 10 haneli şekilde girilmelidir")
      .max(10, "Telefon numarası 10 haneli şekilde girilmelidir")
      .required("Telefon numarası zorunludur"),
  }),
  Yup.object({
    role: Yup.string().required("Bir rol seçmek zorunludur"),
  }),
  Yup.object({
    country: Yup.string(),
  }),
  Yup.object({
    state: Yup.string(),
  }),
  Yup.object({
    city: Yup.string(),
  }),
  Yup.object({
    addressLine: Yup.string(),
  }),
]

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

export { createAccountSchemas, inits }
