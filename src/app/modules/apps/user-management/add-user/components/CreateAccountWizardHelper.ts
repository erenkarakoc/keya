import * as Yup from "yup"

export type ICreateAccount = {
  tc: string
  email: string
  firstName: string
  lastName: string
  password: string
  confirmpassword: string
  photoURL: string
  phoneNumber: string
  birthDate: string
  officeId: string
  role: string
  address: {
    country?: number
    state?: number
    city?: number
    addressLine?: string
  }
  joinedAt: string
  createdAt: string
  updatedAt: string
}

const step0Schema = Yup.object({
  accountType: Yup.string(),
})

const step1Schema = Yup.object({
  firstName: Yup.string()
    .max(50, "Ad en fazla 50 karakterden oluşmalı")
    .required("Ad alanı zorunludur"),
  lastName: Yup.string()
    .max(50, "Soyad en fazla 50 karakterden oluşmalı")
    .required("Soyad alanı zorunludur"),
  tc: Yup.string()
    .min(11, "Kimlik Numarası alanı 11 haneli olmalıdır")
    .max(11, "Kimlik Numarası alanı 11 haneli olmalıdır"),
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
  phoneNumber: Yup.string().matches(
    /^\+/,
    "Telefon numarası + işareti ile başlamalıdır"
  ),
  birthDate: Yup.string(),
  address: Yup.object({
    country: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
    addressLine: Yup.string(),
  }),
  joinedAt: Yup.string(),
})

const step3Schema = Yup.object({
  officeId: Yup.string().required("Bir ofis seçmek zorunludur"),
  role: Yup.string().required("Bir rol seçmek zorunludur"),
})
const step4Schema = Yup.object({
  empty: Yup.string(),
})

const inits: ICreateAccount = {
  tc: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmpassword: "",
  photoURL: "",
  phoneNumber: "",
  birthDate: "",
  officeId: "",
  role: "",
  address: {
    country: undefined,
    state: undefined,
    city: undefined,
    addressLine: "",
  },
  joinedAt: "",
  createdAt: "",
  updatedAt: "",
}

export {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  inits,
}
