/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router-dom"
import React, { ChangeEvent, DragEvent, useEffect, useState } from "react"
import { ErrorMessage, Field, Form, Formik } from "formik"

import toast from "react-hot-toast"
import { AsYouType } from "libphonenumber-js"

import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

import MultiSelect from "../../../modules/apps/components/multiselect/MultiSelect"
import { OfficeDeleteModal } from "../../../modules/apps/office-management/offices-list/office-delete-modal/OfficeDeleteModal"

import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "../../../modules/apps/office-management/add-office/components/CreateOfficeWizardHelper"

import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  generateRandomName,
  slugify,
  getUserRoleText,
} from "../../../../_metronic/helpers/kyHelpers"

import { Office } from "../../../modules/apps/office-management/_core/_models"
import {
  City,
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"

import { getUsersByRole } from "../../../modules/apps/user-management/_core/_requests"
import {
  deleteOffice,
  updateOffice,
} from "../../../modules/apps/office-management/_core/_requests"

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage"
import { getAuth } from "@firebase/auth"
import { firebaseApp } from "../../../../firebase/BaseConfig"

const storage = getStorage(firebaseApp)
const auth = getAuth()

const editOfficeSchema = step1Schema
  .concat(step2Schema)
  .concat(step3Schema)
  .concat(step4Schema)

type Props = {
  office: Office
  setOffice: React.Dispatch<React.SetStateAction<Office | undefined>>
}

const EditOffice: React.FC<Props> = ({ office, setOffice }) => {
  const [submittingForm, setSubmittingForm] = useState<boolean>(false)
  const [officeForEdit, setOfficeForEdit] = useState<Office>({
    ...office,
  })
  const [users, setUsers] = useState<{ id: string; label: string }[]>([])
  const [chosenUsers, setChosenUsers] = useState<
    { id: string; label: string }[]
  >([])

  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const [brokers, setBrokers] = useState<{ id: string; label: string }[]>([])
  const [chosenBrokers, setChosenBrokers] = useState<
    { id: string; label: string }[]
  >([])

  const [countries, setCountries] = useState<Country[]>([])

  const [currentCountry, setCurrentCountry] = useState<string | null>("")
  const [currentState, setCurrentState] = useState<string | null>()
  const [currentCity, setCurrentCity] = useState<string | null>()

  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [countrySelected, setCountrySelected] = useState<boolean>(false)
  const [stateSelected, setStateSelected] = useState<boolean>(false)

  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(
    "+90 312"
  )
  const [countryCode, setCountryCode] = useState<string | null>("TR")

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFiles(Array.from(files), setFieldValue)
    }
  }

  const handleFiles = async (files: File[], setFieldValue: any) => {
    const uploadPromises: Promise<void>[] = []
    const currentCount = uploadedImageUrls.length
    const remainingSlots = 50 - currentCount

    if (currentCount >= 50) {
      toast.error("En fazla 50 görsel ekleyebilirsiniz.")
      return
    }

    const filesToUpload = files.slice(0, remainingSlots)
    const excessFiles = files.slice(remainingSlots)

    filesToUpload.forEach((file) => {
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > 2) {
        toast.error(
          `${file.name} adlı dosya yüklenemedi. Dosya boyutu 2 MB'den küçük olmalıdır!`
        )
        return
      }

      const randomName = generateRandomName()
      const storageRef = ref(
        storage,
        `images/offices/${slugify(office.name)}/${randomName}`
      )
      const uploadPromise = uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((downloadURL) => {
          setUploadedImageUrls((prevUrls) => [...prevUrls, downloadURL])
          setFieldValue("photoURLs", (prevUrls: any) => [
            ...prevUrls,
            downloadURL,
          ])
        })
        .catch((error) => console.error("Error uploading image:", error))

      uploadPromises.push(uploadPromise)
    })

    await Promise.all(uploadPromises)

    if (excessFiles.length > 0) {
      toast.error("En fazla 50 görsel ekleyebilirsiniz.")
    }
  }

  const handleImageDelete = async (url: string, setFieldValue: any) => {
    try {
      const storageRef = ref(storage, url)

      await deleteObject(storageRef)

      setUploadedImageUrls((prevUrls) =>
        prevUrls.filter((prevUrl) => prevUrl !== url)
      )
      setFieldValue("photoURLs", uploadedImageUrls)
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleCountryChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setCurrentCountry(e.target.value)
    setFieldValue("address.country", e.target.value)
    setFieldValue("address.state", "")

    if (e.target.value) {
      const selectedOption = e.target.selectedOptions[0]
      const countryId = selectedOption.getAttribute("country-id")
      const statesArr = await getStatesByCountry(countryId ?? "")
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

    if (e.target.value) {
      const selectedOption = e.target.selectedOptions[0]
      const stateId = selectedOption.getAttribute("state-id")
      const citiesArr = await getCitiesByState(stateId ?? "")
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

  const handleSubmit = async (values: Office) => {
    setSubmittingForm(true)
    try {
      if (!auth.currentUser) {
        console.log("User is not authenticated. Please sign in.")
        return
      }

      values.photoURLs = uploadedImageUrls

      await updateOffice(values)
      setOffice(values)

      toast.success("Ofis bilgileri güncellendi.")
    } catch (ex) {
      toast.error(
        "Ofis bilgileri güncellenirken bir hata oluştu, lütfen tekrar deneyin."
      )

      console.error(ex)
    } finally {
      setSubmittingForm(false)
    }
  }

  useEffect(() => {
    setOfficeForEdit(office)

    const fetchOfficeAddress = async () => {
      const data = await getCountries()
      setCountries(data)

      if (office.address.country) {
        const statesArr = await getStatesByCountry(office.address.country)
        setStates(statesArr || [])
        setCurrentCountry(office.address.country)
        setCountrySelected(true)
      }

      if (office.address.state) {
        const citiesArr = await getCitiesByState(office.address.state)
        setCities(citiesArr || [])
        setCurrentState(office.address.state)
        setStateSelected(true)
      }

      if (office.address.city) {
        setCurrentCity(office.address.city)
      }
    }

    fetchOfficeAddress()
  }, [office])

  useEffect(() => {
    setUploadedImageUrls(office.photoURLs)
    setCurrentPhoneNumber(office.phoneNumber)
  }, [office])

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await getUsersByRole("broker")
        if (response) {
          const brokersArr = response.map((user) => ({
            id: user.id,
            label: user.email,
          }))

          const owners: string[] = office.owners

          const chosenBrokersArr = brokersArr
            .filter((broker) => owners.includes(broker.id))
            .map((broker) => ({
              id: broker.id,
              label: broker.label,
            }))

          setChosenBrokers(chosenBrokersArr)
          setBrokers(brokersArr)
        }
      } catch (error) {
        console.error("Error fetching brokers:", error)
      }
    }

    fetchBrokers()
  }, [office])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const brokersPromise = getUsersByRole("broker")
        const agentsPromise = getUsersByRole("agent")
        const assistantsPromise = getUsersByRole("assistant")
        const humanResourcesPromise = getUsersByRole("human-resources")

        const [brokers, agents, assistants, humanResources] = await Promise.all(
          [
            brokersPromise,
            agentsPromise,
            assistantsPromise,
            humanResourcesPromise,
          ]
        )

        const usersArr = []

        if (brokers) {
          usersArr.push(
            ...brokers.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        if (agents) {
          usersArr.push(
            ...agents.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        if (assistants) {
          usersArr.push(
            ...assistants.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        if (humanResources) {
          usersArr.push(
            ...humanResources.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        setChosenUsers(
          usersArr.filter((user) => office.users?.includes(user.id))
        )
        setUsers(usersArr.flat())
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [office])

  return (
    <Formik
      id="kt_modal_add_office_form"
      className="form"
      onSubmit={handleSubmit}
      initialValues={officeForEdit}
      validationSchema={editOfficeSchema}
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
                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">
                    Profil Fotoğrafı
                  </label>
                  <div className="col-lg-9">
                    <label className="form-label mb-5 w-100 required">
                      Bilgisayarınızdan seçin
                    </label>

                    <div
                      className={`ky-image-input${
                        isDragging ? " dragging" : ""
                      }`}
                      onDragEnter={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragging(true)
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragging(false)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragging(true)
                      }}
                      onDrop={async (e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragging(false)

                        if (
                          e.dataTransfer.files &&
                          e.dataTransfer.files.length > 0
                        ) {
                          await handleFiles(
                            Array.from(e.dataTransfer.files),
                            setFieldValue
                          )
                          e.dataTransfer.clearData()
                        }
                      }}
                    >
                      <input
                        id="ky-office-image-input"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => {
                          handleImageChange(e, setFieldValue)
                        }}
                        multiple
                      />
                      <label htmlFor="ky-office-image-input">
                        Görsel Seç veya Sürükle
                      </label>
                    </div>

                    <div className="form-text mt-4">
                      İzin verilen dosya türleri: png, jpg, jpeg.
                    </div>

                    <div
                      className="image-input image-input-outline d-flex flex-wrap mt-6"
                      data-kt-image-input="true"
                      style={{ maxHeight: 300, overflowY: "auto" }}
                    >
                      {uploadedImageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="image-input-wrapper position-relative w-125px h-125px"
                          style={{
                            backgroundImage: `url(${url})`,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                          onClick={() => {
                            setLightboxOpen(true)
                          }}
                        >
                          <label
                            className="btn btn-icon btn-circle btn-color-white w-20px h-20px bg-gray-300 bg-hover-gray-400 shadow"
                            data-kt-image-input-action="change"
                            data-bs-toggle="tooltip"
                            title="Fotoğrafı Sil"
                            style={{
                              zIndex: 999,
                              top: 15,
                              left: 15,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImageDelete(url, setFieldValue)
                            }}
                          >
                            <i className="bi bi-x fs-7"></i>
                            <input type="hidden" name="avatar_remove" />
                          </label>
                        </div>
                      ))}
                    </div>

                    {uploadedImageUrls.length ? (
                      <div className="form-text mt-2">
                        {uploadedImageUrls.length} görsel yüklendi.
                      </div>
                    ) : (
                      ""
                    )}

                    <Lightbox
                      open={lightboxOpen}
                      close={() => setLightboxOpen(false)}
                      slides={[
                        ...uploadedImageUrls.map((url) => ({ src: url })),
                      ]}
                      plugins={[Thumbnails]}
                    />

                    <div className="text-danger mt-2">
                      <ErrorMessage name="photoURLs" className="mt-10" />
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label required">
                    Ofis Adı
                  </label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <Field
                        placeholder="Ofis Adı"
                        type="text"
                        name="name"
                        className="form-control form-control-solid mb-3 mb-lg-0"
                        autoComplete="off"
                        disabled={submittingForm}
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="name" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label required">
                    Ofis Hakkında Başlığı
                  </label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <Field
                        placeholder="Başlık"
                        name="about.title"
                        className="form-control form-control-solid mb-3 mb-lg-0"
                        autoComplete="off"
                        disabled={submittingForm}
                      />
                      <div className="text-danger mt-2">
                        <ErrorMessage name="about.title" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label required">
                    Ofis Hakkında Açıklaması
                  </label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <Field
                        placeholder="Açıklama"
                        name="about.description"
                        as="textarea"
                        rows={3}
                        className="form-control form-control-solid mb-3 mb-lg-0"
                        autoComplete="off"
                        disabled={submittingForm}
                      />
                      <div className="text-danger mt-2">
                        <ErrorMessage name="about.description" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label required">
                    E-posta
                  </label>
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
                  <label className="col-lg-3 col-form-label required">
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
                  <label className="col-lg-3 col-form-label required">
                    Broker/Brokerlar
                  </label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <MultiSelect
                        options={brokers}
                        defaultValue={chosenBrokers}
                        id="owners"
                        name="owners"
                        notFoundText="Aramanızla eşleşen bir Broker bulunamadı."
                        className="form-control form-control-solid mb-3 mb-lg-0"
                        disabled={submittingForm}
                        placeholder="Broker/Brokerlar"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="owners" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label">Ofis Ekibi</label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <MultiSelect
                        options={users}
                        defaultValue={chosenUsers}
                        id="users"
                        name="users"
                        notFoundText="Aramanızla eşleşen bir kullanıcı bulunamadı."
                        className="form-control form-control-solid mb-3 mb-lg-0"
                        disabled={submittingForm}
                        placeholder="Ekip Üyeleri"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="users" />
                      </div>
                      <div className="form-text">
                        Lütfen ofis ekibine dahil etmek istediğiniz
                        kullanıcıları seçin. Eğer ofisinizde çalışacak
                        kullanıcılar henüz sisteme kayıtlı değilse{" "}
                        <Link
                          to="/arayuz/kullanici-yonetimi/kullanici-ekle"
                          target="_blank"
                        >
                          Kullanıcı Ekle
                        </Link>{" "}
                        sayfasından kaydedebilirsiniz.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label required">
                    Ülke
                  </label>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column ">
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        onChange={(e: any) =>
                          handleCountryChange(e, setFieldValue)
                        }
                        name="address.country"
                        value={currentCountry}
                      >
                        <option></option>
                        {countries &&
                          countries.map((country) => (
                            <option
                              country-id={country.id}
                              value={country.id}
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
                  <label className="col-lg-3 col-form-label required">İl</label>
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
                                value={state.id}
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
                  </div>
                </div>

                <div className="row mb-8">
                  <label className="col-lg-3 col-form-label required">
                    İlçe
                  </label>
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
                                value={city.id}
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

                <div className="row mb-20">
                  <div className="col-lg-3 col-form-label">Ofis Hesabı</div>
                  <div className="col-lg-9">
                    <div className="d-flex flex-column">
                      <button
                        type="button"
                        className="btn btn-light-danger fw-bold btn-sm w-fit-content"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_delete_confirmation_single"
                      >
                        Ofisi Sil
                      </button>
                      <span className="form-text mt-3">
                        Ofis verisi silindikten sonra geri döndürülmesi mümkün
                        olmayacaktır.
                        <br />
                        Lütfen dikkatli olunuz.
                      </span>
                    </div>
                  </div>
                </div>

                <OfficeDeleteModal
                  id="kt_modal_delete_confirmation_single"
                  title="Lütfen dikkatli olun!"
                  description="Devam etmeniz halinde bu ofis kalıcı olarak silinecektir."
                  onApproval={async () => {
                    setSubmittingForm(true)
                    await deleteOffice(office.id)

                    window.location.href = "/arayuz/ofis-yonetimi/ofisler"
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

export { EditOffice }
