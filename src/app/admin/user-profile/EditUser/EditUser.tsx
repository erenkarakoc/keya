/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ChangeEvent, useEffect, useState } from "react"
import { ErrorMessage, Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import { AsYouType } from "libphonenumber-js"

import {
  City,
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"

import { User } from "../../../modules/apps/user-management/_core/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"

import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "../../../modules/apps/user-management/add-user/components/CreateAccountWizardHelper"

import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  generateRandomName,
  slugify,
} from "../../../../_metronic/helpers/kyHelpers"

import { isNotEmpty, toAbsoluteUrl } from "../../../../_metronic/helpers"
import {
  addUsersToOffice,
  deleteUser,
  removeUsersFromOffice,
  updateUser,
} from "../../../modules/apps/user-management/_core/_requests"
import { getAllOffices } from "../../../modules/apps/office-management/_core/_requests"

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage"
import { getAuth } from "@firebase/auth"
import { getFunctions, httpsCallable } from "firebase/functions"
import { firebaseApp } from "../../../../firebase/BaseConfig"
import { UserDeleteModal } from "../../../modules/apps/user-management/users-list/user-delete-modal/UserDeleteModal"
import { useAuth } from "../../../modules/auth"
import imageCompression from "browser-image-compression"

const storage = getStorage(firebaseApp)
const auth = getAuth()
const functions = getFunctions()
const updateEmail = httpsCallable(functions, "updateEmail")

const editUserSchema = step1Schema
  .concat(step2Schema)
  .concat(step3Schema)
  .concat(step4Schema)

type Props = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const EditUser: React.FC<Props> = ({ user, setUser }) => {
  const { currentUser } = useAuth()
  const [submittingForm, setSubmittingForm] = useState<boolean>(false)

  const [userForEdit, setUserForEdit] = useState<User>({
    ...user,
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg")

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
  const [currentOfficeId, setCurrentOfficeId] = useState("")

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
      const citiesArr = await getCitiesByState(
        e.target.value.split("|")[1] ?? ""
      )
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

  const handleSubmit = async (values: User) => {
    setSubmittingForm(true)

    try {
      if (isNotEmpty(values.id)) {
        if (!auth.currentUser) {
          console.error("User is not authenticated. Please sign in.")
          return
        }

        const oldOfficeId = userForEdit.officeId
        const newOfficeId = values.officeId

        await removeUsersFromOffice(oldOfficeId, [values.uid])
        await addUsersToOffice(newOfficeId, [values.uid])

        await updateUser(values)
        await updateEmail({ uid: values.uid, newEmail: values.email })
        setUser(values)

        toast.success("Kullanıcı bilgileri güncellendi.")
      }
    } catch (error) {
      toast.error(
        "Kullanıcı bilgileri güncellenirken bir hata oluştu, lütfen tekrar deneyin."
      )

      console.error(error)
    } finally {
      setSubmittingForm(false)
    }
  }

  const fetchOffices = async () => {
    setOffices(await getAllOffices())
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  useEffect(() => {
    setUserForEdit(user)

    const fetchUserAddress = async () => {
      const data = await getCountries()
      setCountries(data)

      if (user.address?.country) {
        const statesArr = await getStatesByCountry(
          user.address.country.split("|")[1]
        )
        setStates(statesArr || [])
        setCurrentCountry(user.address.country.split("|")[0])
        setCountrySelected(true)
      }

      if (user.address?.state) {
        const citiesArr = await getCitiesByState(
          user.address.state.split("|")[1]
        )
        setCities(citiesArr || [])
        setCurrentState(user.address.state.split("|")[0])
        setStateSelected(true)
      }

      if (user.address?.city) {
        setCurrentCity(user.address.city.split("|")[0])
      }
    }

    fetchUserAddress()

    if (user.officeId) setCurrentOfficeId(user.officeId)
    if (user.phoneNumber) setCurrentPhoneNumber(user.phoneNumber)
    if (user.photoURL) setUploadedImageUrl(user.photoURL)
    if (user.tc) {
      setCurrentIdNo(user.tc)
    }
  }, [user])

  return (
    <Formik
      id="kt_modal_add_office_form"
      className="form"
      onSubmit={handleSubmit}
      initialValues={userForEdit}
      validationSchema={editUserSchema}
      enableReinitialize={true}
      noValidate
    >
      {({ values, setFieldValue, dirty }) => (
        <div className="card">
          {submittingForm ? (
            <div className="d-flex justify-content-center p-20 w-100">
              <span className="spinner-border spinner-border-lg"></span>
            </div>
          ) : (
            <Form
              noValidate
              id="kt_modal_add_user_form"
              placeholder={undefined}
              className="d-flex justify-content-center align-items-center"
            >
              <div className="card-body mw-800px py-20">
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

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">Ad</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <Field
                        placeholder="Ad"
                        type="text"
                        name="firstName"
                        className="form-control form-control-solid"
                        autoComplete="off"
                      />

                      <span className="text-danger mt-1">
                        <ErrorMessage name="firstName" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">Soyad</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <Field
                        placeholder="Soyad"
                        type="text"
                        name="lastName"
                        className="form-control form-control-solid mb-3 mb-lg-0"
                        autoComplete="off"
                      />

                      <span className="text-danger mt-1">
                        <ErrorMessage name="lastName" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">
                    T.C. Kimlik No/Yabancı Kimlik No
                  </label>

                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
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
                            setFieldValue("password", value)
                            setFieldValue("confirmpassword", value)
                          }
                        }}
                      />
                      <div className="text-danger mt-2">
                        <ErrorMessage name="tc" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">E-posta</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <div className="input-group input-group-lg input-group-solid">
                        <span className="input-group-text pe-0">
                          <i className="la la-at fs-4"></i>
                        </span>

                        <Field
                          placeholder="Email"
                          className="form-control form-control-solid mb-3 mb-lg-0"
                          type="email"
                          name="email"
                          autoComplete="off"
                        />
                      </div>
                      <span className="text-danger mt-2">
                        <ErrorMessage name="email" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">
                    Telefon Numarası
                  </label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column position-relative">
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
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">
                    <span>Doğum Tarihi</span>
                  </label>

                  <div className="col-lg-9">
                    <div className="d-flex flex-column position-relative">
                      <Field
                        type="date"
                        className="form-control form-control-lg form-control-solid"
                        name="birthDate"
                      />
                      <div className="text-danger mt-2">
                        <ErrorMessage name="birthDate" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">Ülke</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        onChange={(e: any) => {
                          handleCountryChange(e, setFieldValue)
                        }}
                        name="address.country"
                        value={currentCountry}
                      >
                        <option></option>
                        {countries &&
                          countries.map((country) => (
                            <option
                              value={
                                country.translations.tr + "|" + country.id ||
                                country.name + "|" + country.id
                              }
                              key={country.id}
                            >
                              {country.translations.tr}
                            </option>
                          ))}
                      </Field>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="address.country" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">İl</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        onChange={(e: any) =>
                          handleStateChange(e, setFieldValue)
                        }
                        name="address.state"
                        disabled={!countrySelected}
                        value={currentState}
                      >
                        <option></option>
                        {countrySelected
                          ? states.map((state) => (
                              <option
                                value={state.name + "|" + state.id}
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
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">İlçe</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        onChange={(e: any) =>
                          handleCityChange(e, setFieldValue)
                        }
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
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">Adres</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <Field
                        className="form-control form-control-lg form-control-solid"
                        name="address.addressLine"
                      />
                      <div className="text-danger mt-2">
                        <ErrorMessage name="address.addressLine" />
                      </div>

                      <div className="form-text">Detaylı adres bilgisi</div>
                    </div>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">Ofisi</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <select
                        className="form-select form-select-lg form-select-solid"
                        name="officeId"
                        value={currentOfficeId}
                        onChange={(e) => {
                          setCurrentOfficeId(e.target.value)
                          setFieldValue("officeId", e.target.value)
                        }}
                      >
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

                      <div className="text-danger mt-2">
                        <ErrorMessage name="officeId" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                {(currentUser?.role === "admin" ||
                  currentUser?.id != user.id) &&
                  (currentUser?.role === "admin" ||
                    currentUser?.role === "broker" ||
                    currentUser?.role === "assistant" ||
                    currentUser?.role === "human-resources") && (
                    <>
                      <div className="row mb-8">
                        <label className="col-lg-3 col-form-label">
                          Ünvanı
                        </label>
                        <div className="col-lg-9">
                          <div className="d-flex flex-column ">
                            <div className="d-flex fv-row">
                              <div className="form-check form-check-custom form-check-solid pointer">
                                <Field
                                  className="form-check-input me-3"
                                  name="role"
                                  type="radio"
                                  value="admin"
                                  id="kt_modal_update_role_option_0"
                                  checked={values.role === "admin"}
                                />

                                <label
                                  className="form-check-label"
                                  htmlFor="kt_modal_update_role_option_0"
                                >
                                  <div className="fw-bolder text-gray-800">
                                    Yönetici
                                  </div>
                                  <div className="text-gray-600">
                                    Tüm yetkiler
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
                                  value="broker"
                                  id="kt_modal_update_role_option_1"
                                  checked={values.role === "broker"}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="kt_modal_update_role_option_1"
                                >
                                  <div className="fw-bolder text-gray-800">
                                    Broker
                                  </div>
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
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="kt_modal_update_role_option_3"
                                >
                                  <div className="fw-bolder text-gray-800">
                                    İnsan Kaynakları
                                  </div>
                                  <div className="text-gray-600">
                                    Danışmanlar ve personeller dahilinde
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
                                  id="kt_modal_update_role_option_4"
                                  value="franchise-manager"
                                  checked={values.role === "franchise-manager"}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="kt_modal_update_role_option_4"
                                >
                                  <div className="fw-bolder text-gray-800">
                                    Franchise Yöneticisi
                                  </div>
                                  <div className="text-gray-600">
                                    Franchise ofisler ve yeni broker adayları
                                    dahilinde yetkiler
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
                        </div>
                      </div>

                      <div className="separator separator-dashed my-10"></div>

                      <div className="row mb-8">
                        <label className="col-lg-3 col-form-label">
                          <span>Referans Adı Soyadı</span>
                        </label>

                        <div className="col-lg-9">
                          <div className="d-flex flex-column ">
                            <Field
                              className="form-control form-control-lg form-control-solid"
                              name="ref"
                            />
                            <div className="text-danger mt-2">
                              <ErrorMessage name="ref" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-8">
                        <label className="col-lg-3 col-form-label">
                          <span>Katılım Tarihi</span>
                        </label>

                        <div className="col-lg-9">
                          <div className="d-flex flex-column ">
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
                      </div>
                    </>
                  )}

                <div className="row mb-20">
                  <div className="col-lg-3 col-form-label">
                    Kullanıcı Hesabı
                  </div>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <button
                        type="button"
                        className="btn btn-light-danger fw-bold btn-sm w-fit-content"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_delete_confirmation_single"
                      >
                        Kullanıcıyı Sil
                      </button>
                      <span className="form-text mt-3">
                        Kullanıcı verisi silindikten sonra geri döndürülmesi
                        mümkün olmayacaktır.
                        <br />
                        Lütfen dikkatli olunuz.
                      </span>
                    </div>
                  </div>
                </div>

                <UserDeleteModal
                  id="kt_modal_delete_confirmation_single"
                  title="Lütfen dikkatli olun!"
                  description="Devam etmeniz halinde bu kullanıcı kalıcı olarak silinecektir."
                  onApproval={async () => {
                    setSubmittingForm(true)
                    await deleteUser(user.id)

                    window.location.href =
                      "/arayuz/kullanici-yonetimi/kullanicilar"
                  }}
                />

                <div className="row">
                  <label className="col-lg-3 col-form-label"></label>
                  <div className="col-lg-9">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSubmit(values)}
                      disabled={!dirty}
                    >
                      {submittingForm ? (
                        <span className="indicator-label">
                          Güncelleniyor...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      ) : (
                        <span className="indicator-label">Güncelle</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </div>
      )}
    </Formik>
  )
}

export { EditUser }
