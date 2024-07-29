/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent } from "react"

import * as Yup from "yup"
import { ErrorMessage, Field, Form, Formik } from "formik"

import { UsersListLoading } from "../components/loading/UsersListLoading"
import { useQueryResponse } from "../../_core/QueryResponseProvider"

import { User } from "../../_core/_models"
import { useListView } from "../../_core/ListViewProvider"
import {
  addUsersToOffice,
  removeUsersFromOffice,
  updateUser,
} from "../../_core/_requests"

import { isNotEmpty, toAbsoluteUrl } from "../../../../../../_metronic/helpers"
import { Office } from "../../../office-management/_core/_models"
import { getAllOffices } from "../../../office-management/_core/_requests"

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { firebaseApp } from "../../../../../../firebase/BaseConfig"
import { httpsCallable, getFunctions } from "firebase/functions"
import { getAuth } from "@firebase/auth"

import { AsYouType } from "libphonenumber-js"
import toast from "react-hot-toast"
import {
  City,
  Country,
  State,
} from "../../../../../../_metronic/helpers/address-helper/_models"
import {
  generateRandomName,
  getCitiesByState,
  getCountries,
  getStatesByCountry,
  slugify,
  timestampToISODate,
} from "../../../../../../_metronic/helpers/kyHelpers"

import imageCompression from "browser-image-compression"

const storage = getStorage(firebaseApp)
const auth = getAuth()
const functions = getFunctions()
const updateEmail = httpsCallable(functions, "updateEmail")

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  avatar: Yup.string(),
  firstName: Yup.string()
    .min(3, "Ad en az 3 karakterden oluşmalı")
    .max(50, "Ad fazla 50 karakterden oluşmalı")
    .required("Ad alanı zorunludur"),
  lastName: Yup.string()
    .min(3, "Soyad en az 3 karakterden oluşmalı")
    .max(50, "Soyad en fazla 50 karakterden oluşmalı")
    .required("Soyad alanı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi gir")
    .min(3, "E-posta en az 3 karakterden oluşmalı")
    .max(50, "E-posta 50 karakterden oluşmalı")
    .required("E-posta girilmesi zorunludur"),
  officeId: Yup.string().required("Bir ofis seçilmesi zorunludur"),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const [submittingForm, setSubmittingForm] = useState<boolean>(false)
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [countries, setCountries] = useState<Country[]>([])

  const [currentCountry, setCurrentCountry] = useState<string | null>("")
  const [currentState, setCurrentState] = useState<string | null>()
  const [currentCity, setCurrentCity] = useState<string | null>()

  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [countrySelected, setCountrySelected] = useState<boolean>(false)
  const [stateSelected, setStateSelected] = useState<boolean>(false)

  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(
    "+90 "
  )
  const [countryCode, setCountryCode] = useState<string | null>("TR")
  const [currentIdNo, setCurrentIdNo] = useState("")

  const [offices, setOffices] = useState<Office[]>()

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg")

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    if (e.target.files?.[0]) {
      setUploadingImage(true)

      let readyToUpload = e.target.files[0]
      const fileSizeInMB = readyToUpload.size / (1024 * 1024)

      if (fileSizeInMB > 2) {
        try {
          const compressionPromise = imageCompression(readyToUpload, {
            maxSizeMB: 2,
          })

          toast.promise(
            compressionPromise,
            {
              loading: `${readyToUpload.name} adlı yüksek boyutlu görsel sıkıştırılıyor, lütfen bekleyin...`,
              success: `${readyToUpload.name} adlı görsel başarıyla sıkıştırıldı.`,
              error: `${readyToUpload.name} adlı görsel sıkıştırılamadı. Lütfen tekrar deneyin veya farklı bir görsel yükleyin.`,
            },
            {
              id: readyToUpload.name,
              success: {
                duration: 2000,
              },
              position: "bottom-right",
            }
          )

          const compressedFile = await compressionPromise
          readyToUpload = compressedFile
        } catch (error) {
          toast.error(
            `${readyToUpload.name} adlı dosya yüklenemedi. Dosya boyutu 5 MB'den küçük olmalıdır!`
          )
        }
      }

      try {
        const randomName = generateRandomName()
        const storageRef = ref(
          storage,
          `images/users/${slugify(
            user.firstName + "-" + user.lastName
          )}-${randomName}`
        )
        await uploadBytes(storageRef, readyToUpload)
        const downloadURL = await getDownloadURL(storageRef)
        setUploadedImageUrl(downloadURL)
        setFieldValue("photoURL", downloadURL)
      } catch (error) {
        console.error("Error uploading image:", error)
        setUploadedImageUrl(null)
      }
    }

    setUploadingImage(false)
  }

  const handleImageDelete = async (setFieldValue: any) => {
    if (uploadedImageUrl) {
      try {
        const storageRef = ref(storage, uploadedImageUrl)
        await deleteObject(storageRef)
        setFieldValue("photoURL", "")
        setUploadedImageUrl("")
        toast.success("Görsel silindi.")
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  const handleCountryChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setCurrentCountry(e.target.value)
    setFieldValue("address.country", e.target.value)
    setFieldValue("address.state", "")
    setFieldValue("address.city", "")
    setCurrentState("")
    setCurrentCity("")

    if (e.target.value) {
      const statesArr = await getStatesByCountry(e.target.value.split("|")[1])

      setStates(statesArr || [])
      setCountrySelected(true)
    } else {
      setStates([])
      setCities([])
      setFieldValue("address.state", "")
      setFieldValue("address.city", "")
      setCountrySelected(false)
    }
  }

  const handleStateChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setCurrentState(e.target.value)
    setFieldValue("address.state", e.target.value)
    setFieldValue("address.city", "")
    setCurrentCity("")

    if (e.target.value) {
      const selectedOption = e.target.selectedOptions[0]
      const stateId = selectedOption.getAttribute("state-id") ?? ""
      const citiesArr = await getCitiesByState(stateId)

      console.log(stateId)

      setCities(citiesArr || [])
      setStateSelected(true)
    } else {
      setCities([])
      setFieldValue("address.city", "")
      setStateSelected(false)
    }
  }

  const handleCityChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setCurrentCity(e.target.value)
    setFieldValue("address.city", e.target.value)
  }

  const handlePhoneNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const asYouType = new AsYouType()
    const formatted = asYouType.input(e.target.value)
    const countryCode = asYouType.getNumber()?.country

    setCurrentPhoneNumber(formatted)
    setFieldValue("phoneNumber", formatted)
    setCountryCode(countryCode ? countryCode : "")
  }

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const handleSubmit = async (values: User) => {
    setSubmittingForm(true)
    try {
      if (isNotEmpty(values.id)) {
        if (!auth.currentUser) {
          console.log("User is not authenticated. Please sign in.")
          return
        }

        const oldOfficeId = user.officeId
        const newOfficeId = values.officeId

        await removeUsersFromOffice(oldOfficeId, [values.uid])
        await addUsersToOffice(newOfficeId, [values.uid])

        values.updatedAt = timestampToISODate(new Date().getTime().toString())
        await updateUser(values)
        await updateEmail({ uid: values.uid, newEmail: values.email })

        toast.success("Kullanıcı bilgileri güncellendi.")
      }
    } catch (error) {
      toast.error(
        "Kullanıcı bilgileri güncellenirken bir hata oluştu, lütfen tekrar deneyin."
      )

      console.error(error)
    } finally {
      setSubmittingForm(false)
      cancel(true)
    }
  }

  const fetchOffices = async () => {
    setOffices(await getAllOffices())
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  useEffect(() => {
    const fetchAddress = async () => {
      const data = await getCountries()
      setCountries(data)

      if (user.address?.country) {
        const statesArr = await getStatesByCountry(
          user.address.country.split("|")[1]
        )
        setStates(statesArr || [])
        setCurrentCountry(user.address.country)
        setCountrySelected(true)
      }

      if (user.address?.state) {
        const citiesArr = await getCitiesByState(
          user.address.state.split("|")[1]
        )
        setCities(citiesArr || [])
        setCurrentState(user.address.state)
        setStateSelected(true)
      }

      if (user.address?.city) {
        setCurrentCity(user.address.city)
      }
    }

    fetchAddress()
  }, [user])

  useEffect(() => {
    if (user.phoneNumber) setCurrentPhoneNumber(user.phoneNumber)
    if (user.photoURL) setUploadedImageUrl(user.photoURL)
    if (user.tc) {
      setCurrentIdNo(user.tc)
    }
  }, [user])

  return (
    <>
      <Formik
        id="kt_modal_add_office_form"
        className="form"
        onSubmit={handleSubmit}
        initialValues={user}
        validationSchema={editUserSchema}
        enableReinitialize={true}
        noValidate
      >
        {({ values, setFieldValue }) => (
          <Form noValidate id="kt_modal_add_user_form" placeholder={undefined}>
            <div
              className="d-flex flex-column me-n7 pe-7 pt-5"
              id="kt_modal_add_user_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_user_header"
              data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
              data-kt-scroll-offset="300px"
            >
              <div className="fv-row mb-7">
                {/* begin::Image input */}
                <div
                  className="image-input image-input-outline"
                  data-kt-image-input="true"
                  style={{
                    backgroundImage: `url('${
                      uploadedImageUrl ? uploadedImageUrl : blankImg
                    }')`,
                  }}
                >
                  {/* begin::Preview existing avatar */}
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{
                      backgroundImage: `url('${
                        uploadedImageUrl ? uploadedImageUrl : blankImg
                      }')`,
                    }}
                  ></div>
                  {/* end::Preview existing avatar */}

                  {/* begin::Label */}
                  <label
                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="change"
                    data-bs-toggle="tooltip"
                    title="Fotoğraf Seçin"
                  >
                    <i className="bi bi-pencil-fill fs-7"></i>

                    <input
                      type="file"
                      name="avatar"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />

                    <input
                      type="hidden"
                      name="photoURL"
                      value={uploadedImageUrl ? uploadedImageUrl : ""}
                      className="d-none"
                      disabled
                    />
                  </label>
                  {/* end::Label */}

                  {/* begin::Cancel */}
                  {uploadedImageUrl && (
                    <span
                      className="btn btn-icon btn-circle btn-color-white w-25px h-25px bg-body shadow"
                      data-kt-image-input-action="remove"
                      data-bs-toggle="tooltip"
                      title="Fotoğrafı Sil"
                      onClick={() => handleImageDelete(setFieldValue)}
                    >
                      <i className="bi bi-x fs-7 text-gray-600"></i>
                    </span>
                  )}
                  {/* end::Cancel */}
                </div>
                {/* end::Image input */}

                <div className="form-text">
                  İzin verilen dosya türleri: png, jpg, jpeg.
                </div>

                <div className="text-danger mt-2">
                  <ErrorMessage name="photoURL" className="mt-10" />
                </div>

                {uploadingImage ? (
                  <div className="d-flex align-items-center gap-5 mt-5">
                    <div className="text-gray-600 fw-semibold fs-7">
                      <span className="spinner-border spinner-border-lg"></span>
                    </div>
                    <span className="text-gray-600">
                      Görsel karşıya yükleniyor.
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Ad</label>

                <Field
                  placeholder="Ad"
                  type="text"
                  name="firstName"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                />

                <ErrorMessage name="firstName" />
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Soyad</label>

                <Field
                  placeholder="Soyad"
                  type="text"
                  name="lastName"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                />

                <ErrorMessage name="lastName" />
              </div>

              <div className="mb-10 fv-row">
                <label className="form-label mb-3">
                  T.C. Kimlik No/Yabancı Kimlik No
                </label>

                <Field
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  name="tc"
                  value={currentIdNo}
                  onChange={(e: any) => {
                    e.preventDefault()
                    const value = e.target.value

                    if (/^\d*$/.test(value)) {
                      setCurrentIdNo(value)
                      setFieldValue("tc", value)
                    }
                  }}
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="tc" />
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">E-posta</label>

                <Field
                  placeholder="Email"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  type="email"
                  name="email"
                  autoComplete="off"
                />

                <ErrorMessage name="email" />
              </div>

              <div className="fv-row mb-10">
                <label className="form-label required">Telefon Numarası</label>

                <div className="position-relative">
                  <Field
                    className="form-control form-control-lg form-control-solid"
                    placeholder="+90 5xx xxx xx xx"
                    onChange={(e: any) =>
                      handlePhoneNumberChange(e, setFieldValue)
                    }
                    value={currentPhoneNumber}
                    style={{ paddingLeft: "40px" }}
                    name="phoneNumber"
                  />
                  <span
                    className={`fi fi-${countryCode?.toLowerCase()} position-absolute`}
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: "13px",
                    }}
                  ></span>
                </div>
                <div className="text-danger mt-2">
                  <ErrorMessage name="phoneNumber" />
                </div>
                <div className="form-text">
                  Lütfen numaranın başında ülke kodu bulundurun. Örn. +90
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="d-flex align-items-center form-label">
                  <span>Doğum Tarihi</span>
                </label>

                <Field
                  type="date"
                  className="form-control form-control-lg form-control-solid"
                  name="birthDate"
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="birthDate" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label">Ülke</label>

                <Field
                  as="select"
                  className="form-select form-select-lg form-select-solid"
                  onChange={(e: any) => handleCountryChange(e, setFieldValue)}
                  name="address.country"
                  value={currentCountry}
                >
                  <option></option>
                  {countries &&
                    countries.map((country) => (
                      <option
                        value={
                          (country.translations.tr || country.name) +
                          "|" +
                          country.id
                        }
                        key={country.id}
                      >
                        {country.translations.tr || country.name}
                      </option>
                    ))}
                </Field>
                <div className="text-danger mt-2">
                  <ErrorMessage name="address.country" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label">İl</label>

                <Field
                  as="select"
                  className="form-select form-select-lg form-select-solid"
                  onChange={(e: any) => handleStateChange(e, setFieldValue)}
                  name="address.state"
                  disabled={!countrySelected}
                  value={currentState}
                >
                  <option></option>
                  {countrySelected
                    ? states.map((state) => (
                        <option
                          value={state.name + "|" + state.id}
                          state-id={state.id}
                          key={state.id}
                        >
                          {state.name}
                        </option>
                      ))
                    : ""}
                </Field>
                <div className="text-danger mt-2">
                  <ErrorMessage name="address.state" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label">İlçe</label>

                <Field
                  as="select"
                  className="form-select form-select-lg form-select-solid"
                  onChange={(e: any) => handleCityChange(e, setFieldValue)}
                  name="address.city"
                  disabled={!stateSelected && !countrySelected}
                  value={currentCity}
                >
                  <option></option>
                  {countrySelected && stateSelected
                    ? cities.map((city) => (
                        <option
                          value={city.name + "|" + city.id}
                          city-id={city.id}
                          key={city.id}
                        >
                          {city.name}
                        </option>
                      ))
                    : ""}
                </Field>
                <div className="text-danger mt-2">
                  <ErrorMessage name="address.city" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="d-flex align-items-center form-label">
                  <span>Adres</span>
                </label>

                <Field
                  className="form-control form-control-lg form-control-solid"
                  name="address.addressLine"
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="address.addressLine" />
                </div>

                <div className="form-text">Detaylı adres bilgisi</div>
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Ofisi</label>

                <select
                  className="form-select form-select-lg form-select-solid"
                  name="officeId"
                  value={values.officeId}
                  onChange={(e) => {
                    setFieldValue("officeId", e.target.value)
                  }}
                >
                  <option></option>
                  {offices &&
                    offices.map((office) => (
                      <option
                        value={office.id}
                        office-id={office.id}
                        key={office.id}
                      >
                        {import.meta.env.VITE_APP_NAME} {office.name}
                      </option>
                    ))}
                </select>
                <ErrorMessage name="officeId" />
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-5">Ünvanı</label>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input me-3"
                      name="role"
                      type="radio"
                      value="admin"
                      id="kt_modal_update_role_option_0"
                      checked={values.role === "admin"}
                      disabled={submittingForm || isUserLoading}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="kt_modal_update_role_option_0"
                    >
                      <div className="fw-bolder text-gray-800">Yönetici</div>
                      <div className="text-gray-600">Tüm yetkiler</div>
                    </label>
                  </div>
                </div>
                <div className="separator separator-dashed my-5"></div>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input me-3"
                      name="role"
                      type="radio"
                      value="broker"
                      id="kt_modal_update_role_option_1"
                      checked={values.role === "broker"}
                      disabled={submittingForm || isUserLoading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="kt_modal_update_role_option_1"
                    >
                      <div className="fw-bolder text-gray-800">Broker</div>
                      <div className="text-gray-600">
                        Franchise ofisi dahilinde tüm yetkiler
                      </div>
                    </label>
                  </div>
                </div>

                <div className="separator separator-dashed my-5"></div>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input me-3"
                      name="role"
                      type="radio"
                      value="assistant"
                      id="kt_modal_update_role_option_2"
                      checked={values.role === "assistant"}
                      disabled={submittingForm || isUserLoading}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="kt_modal_update_role_option_2"
                    >
                      <div className="fw-bolder text-gray-800">
                        Ofis Asistanı
                      </div>
                      <div className="text-gray-600">
                        Franchise ofisi dahilinde üst düzey yetkiler
                      </div>
                    </label>
                  </div>
                </div>
                <div className="separator separator-dashed my-5"></div>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input me-3"
                      name="role"
                      type="radio"
                      value="human-resources"
                      id="kt_modal_update_role_option_3"
                      checked={values.role === "human-resources"}
                      disabled={submittingForm || isUserLoading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="kt_modal_update_role_option_3"
                    >
                      <div className="fw-bolder text-gray-800">
                        İnsan Kaynakları
                      </div>
                      <div className="text-gray-600">
                        Danışmanlar ve personeller dahilinde yetkiler
                      </div>
                    </label>
                    {/* end::Label */}
                  </div>
                  {/* end::Radio */}
                </div>
                <div className="separator separator-dashed my-5"></div>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input me-3"
                      name="role"
                      type="radio"
                      id="kt_modal_update_role_option_4"
                      value="franchise-manager"
                      checked={values.role === "franchise-manager"}
                      disabled={submittingForm || isUserLoading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="kt_modal_update_role_option_4"
                    >
                      <div className="fw-bolder text-gray-800">
                        Franchise Yöneticisi
                      </div>
                      <div className="text-gray-600">
                        Franchise ofisler ve yeni broker adayları dahilinde
                        yetkiler
                      </div>
                    </label>
                  </div>
                </div>
                <div className="separator separator-dashed my-5"></div>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input me-3"
                      name="role"
                      type="radio"
                      id="kt_modal_update_role_option_5"
                      value="agent"
                      checked={values.role === "agent"}
                      disabled={submittingForm || isUserLoading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="kt_modal_update_role_option_5"
                    >
                      <div className="fw-bolder text-gray-800">
                        Gayrimenkul Danışmanı
                      </div>
                      <div className="text-gray-600">
                        Kendi portföyleri dahilinde yetkiler
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="d-flex align-items-center form-label">
                  <span>Referans Adı Soyadı</span>
                </label>

                <Field
                  className="form-control form-control-lg form-control-solid"
                  name="ref"
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="ref" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="d-flex align-items-center form-label">
                  <span>Katılım Tarihi</span>
                </label>

                <Field
                  type="date"
                  className="form-control form-control-lg form-control-solid"
                  name="joinedAt"
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="joinedAt" />
                </div>
              </div>
            </div>

            <div className="text-center pt-15">
              <button
                type="reset"
                onClick={() => cancel()}
                className="btn btn-light me-3"
                data-kt-users-modal-action="cancel"
                disabled={submittingForm || isUserLoading}
              >
                İptal
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                data-kt-users-modal-action="submit"
              >
                <span className="indicator-label">Kaydet</span>
                {(submittingForm || isUserLoading) && (
                  <span className="indicator-progress">
                    Lütfen Bekleyin...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {(submittingForm || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
