/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent } from "react"

import clsx from "clsx"
import toast from "react-hot-toast"

import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

import {
  Country,
  State,
  City,
} from "../../../../../../_metronic/helpers/address-helper/_models"
import { Office } from "../../_core/_models"

import {
  generateRandomName,
  slugify,
} from "../../../../../../_metronic/helpers/kyHelpers"
import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
} from "../../../../../../_metronic/helpers/kyHelpers"

import { OfficesListLoading } from "../components/loading/OfficesListLoading"
import { useListView } from "../../_core/ListViewProvider"
import { useQueryResponse } from "../../_core/QueryResponseProvider"

import { getUsersByRole } from "../../../user-management/_core/_requests"
import { updateOffice } from "../../_core/_requests"

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { firebaseApp } from "../../../../../../firebase/BaseConfig"
import { getAuth } from "@firebase/auth"

import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

import MultiSelect from "../../../components/multiselect/MultiSelect"

import { AsYouType } from "libphonenumber-js"

const storage = getStorage(firebaseApp)
const auth = getAuth()

type Props = {
  isOfficeLoading: boolean
  office: Office
}

const editOfficeSchema = Yup.object().shape({
  avatar: Yup.string(),
  name: Yup.string()
    .min(3, "Ad en az 3 karakterden oluşmalı")
    .max(50, "Ad fazla 50 karakterden oluşmalı")
    .required("Ad alanı zorunludur"),
  about: Yup.string().required("Hakkında alanı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi gir")
    .min(3, "E-posta en az 3 karakterden oluşmalı")
    .max(50, "E-posta 50 karakterden oluşmalı")
    .required("E-posta girilmesi zorunludur"),
})

const OfficeEditModalForm: FC<Props> = ({ office, isOfficeLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [submittingForm, setSubmittingForm] = useState<boolean>(false)

  const [lightboxOpen, setLightboxOpen] = useState(false)

  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  const [brokers, setBrokers] = useState<{ id: string; label: string }[]>([])
  const [chosenBrokers, setChosenBrokers] = useState<
    { id: string; label: string }[]
  >([])

  const [countries, setCountries] = useState<Country[]>([])

  const [currentCountry, setCurrentCountry] = useState<string | null>("Türkiye")
  const [currentState, setCurrentState] = useState<string | null>("")
  const [currentCity, setCurrentCity] = useState<string | null>("")

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
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const uploadPromises: Promise<void>[] = []

      files.forEach((file) => {
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
          `images/offices/${slugify(office.name)}-${randomName}`
        )
        const uploadPromise = uploadBytes(storageRef, file)
          .then(() => getDownloadURL(storageRef))
          .then((downloadURL) => {
            setUploadedImageUrls((prevUrls) => [...prevUrls, downloadURL])
            setFieldValue("photoURLs", [...uploadedImageUrls, downloadURL])
          })
          .catch((error) => console.error("Error uploading image:", error))

        uploadPromises.push(uploadPromise)
      })

      await Promise.all(uploadPromises)
    }
  }

  const handleImageDelete = async (url: string) => {
    try {
      const storageRef = ref(storage, url)

      await deleteObject(storageRef)

      setUploadedImageUrls((prevUrls) =>
        prevUrls.filter((prevUrl) => prevUrl !== url)
      )

      toast.success("Görsel başarıyla silindi.")
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Görsel silinirken bir hata oluştu.")
    }
  }

  const handleCountryChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setFieldValue("country", e.target.value)
    setCurrentCountry(e.target.value)

    if (e.target.value) {
      const selectedOption = e.target.selectedOptions[0]
      const countryId = selectedOption.getAttribute("country-id")
      const statesArr = getStatesByCountry(parseInt(countryId as string))
      setStates(statesArr || [])
      setCountrySelected(true)
    } else {
      setStates([])
      setCountrySelected(false)
    }
  }

  const handleStateChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setCurrentState(e.target.value)
    setFieldValue("state", e.target.value)

    if (e.target.value) {
      const selectedOption = e.target.selectedOptions[0]
      const stateId = selectedOption.getAttribute("state-id")
      const citiesArr = getCitiesByState(parseInt(stateId as string))
      setCities(citiesArr || [])
      setStateSelected(true)
    } else {
      setCities([])
      setStateSelected(false)
    }
  }

  const handleCityChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setFieldValue: any
  ) => {
    setCurrentCity(e.target.value)
    setFieldValue("city", e.target.value)
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

  const handleSubmit = async (values: Office) => {
    setSubmittingForm(true)
    try {
      if (!auth.currentUser) {
        console.log("User is not authenticated. Please sign in.")
        return
      }

      values.photoURLs = uploadedImageUrls

      await updateOffice(values)

      toast.success("Ofis bilgileri güncellendi.")
    } catch (ex) {
      toast.error(
        "Ofis bilgileri güncellenirken bir hata oluştu, lütfen tekrar deneyin."
      )

      console.error(ex)
    } finally {
      setSubmittingForm(false)
      cancel(true)
    }
  }

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
    setUploadedImageUrls(office.photoURLs)
  }, [office])

  useEffect(() => {
    const data = getCountries()
    setCountries(data)

    const statesArr = getStatesByCountry(225)
    setStates(statesArr || [])
    setCountrySelected(true)
  }, [])

  // useEffect(() => {
  //   setFieldValue("country", currentCountry as string)
  // }, [setFieldValue, currentCountry])

  return (
    <>
      <Formik
        id="kt_modal_add_office_form"
        className="form"
        onSubmit={handleSubmit}
        initialValues={office}
        validationSchema={editOfficeSchema}
        enableReinitialize={true}
        noValidate
      >
        {({ values, setFieldValue, dirty, isValid }) => (
          <Form noValidate id="office_edit_modal_form" placeholder={undefined}>
            {/* begin::Scroll */}
            <div
              className="d-flex flex-column me-n7 pe-7 pt-5"
              id="kt_modal_add_office_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_office_header"
              data-kt-scroll-wrappers="#kt_modal_add_office_scroll"
              data-kt-scroll-offset="300px"
            >
              <div className="fv-row mb-7">
                <label className="form-label mb-5 w-100 required">
                  Bilgisayarınızdan seçin
                </label>

                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  multiple
                />

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
                          handleImageDelete(url)
                        }}
                      >
                        <i className="bi bi-x fs-7"></i>
                        <input type="hidden" name="avatar_remove" />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="form-text mt-6">
                  İzin verilen dosya türleri: png, jpg, jpeg.
                </div>

                <Lightbox
                  open={lightboxOpen}
                  close={() => setLightboxOpen(false)}
                  slides={[...values.photoURLs.map((url) => ({ src: url }))]}
                  plugins={[Thumbnails]}
                />
              </div>

              <div className="fv-row mb-7">
                {/* begin::Label */}
                <label className="required fw-bold fs-6 mb-2">Ofis Adı</label>
                {/* end::Label */}

                {/* begin::Input */}
                <Field
                  placeholder="Ofis Adı"
                  type="text"
                  name="name"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid": submittingForm && values.name === "",
                    },
                    {
                      "is-valid": !submittingForm && values.name !== "",
                    }
                  )}
                  value={values.name}
                  autoComplete="off"
                  disabled={submittingForm || isOfficeLoading}
                />
                <ErrorMessage name="name" />
                {/* end::Input */}
              </div>

              <div className="fv-row mb-7">
                {/* begin::Label */}
                <label className="required fw-bold fs-6 mb-2">
                  Ofis Hakkında
                </label>
                {/* end::Label */}

                {/* begin::Textarea */}
                <Field
                  placeholder="Ofis Hakkında"
                  name="about"
                  as="textarea"
                  rows={3}
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid": submittingForm && values.about === "",
                    },
                    {
                      "is-valid": !submittingForm && values.about !== "",
                    }
                  )}
                  autoComplete="off"
                  disabled={submittingForm || isOfficeLoading}
                />
                <ErrorMessage name="about" />
                {/* end::Textarea */}
              </div>

              <div className="fv-row mb-7">
                {/* begin::Label */}
                <label className="required fw-bold fs-6 mb-2">
                  Broker/Brokerlar
                </label>
                {/* end::Label */}

                {/* begin::Input */}
                <MultiSelect
                  options={brokers}
                  defaultValue={chosenBrokers}
                  id="owners"
                  name="owners"
                  notFoundText="Aramanızla eşleşen bir Broker bulunamadı."
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid":
                        submittingForm && values.owners.length === 0,
                    },
                    {
                      "is-valid": !submittingForm && values.owners.length > 0,
                    }
                  )}
                  disabled={submittingForm || isOfficeLoading}
                  placeholder="Broker/Brokerlar"
                />

                {/* end::Input */}
                <ErrorMessage name="owners" />
              </div>

              <div className="fv-row mb-7">
                {/* begin::Label */}
                <label className="required fw-bold fs-6 mb-2">E-posta</label>
                {/* end::Label */}

                {/* begin::Input */}
                <Field
                  placeholder="Email"
                  type="email"
                  name="email"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid": submittingForm && values.email === "",
                    },
                    {
                      "is-valid": !submittingForm && values.email !== "",
                    }
                  )}
                  autoComplete="off"
                  value={values.email}
                  disabled={submittingForm || isOfficeLoading}
                />
                <ErrorMessage name="email" />
                {/* end::Input */}
              </div>

              <div className="fv-row mb-10">
                <label className="form-label required">Telefon Numarası</label>

                <div className="position-relative">
                  <Field
                    className="form-control form-control-lg form-control-solid"
                    placeholder="+90 5xx xxx xx xx"
                    onChange={handlePhoneNumberChange}
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
                <label className="form-label">Ülke</label>

                <Field
                  as="select"
                  className="form-select form-select-lg form-select-solid"
                  onChange={(e: any) => handleCountryChange(e, setFieldValue)}
                  name="country"
                  value={currentCountry}
                >
                  <option></option>
                  {countries &&
                    countries.map((country) => (
                      <option
                        country-id={country.id}
                        value={country.translations.tr}
                        key={country.id}
                      >
                        {country.translations.tr}
                      </option>
                    ))}
                </Field>
                <div className="text-danger mt-2">
                  <ErrorMessage name="country" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label">İl</label>

                <Field
                  as="select"
                  className="form-select form-select-lg form-select-solid"
                  onChange={(e: any) => handleStateChange(e, setFieldValue)}
                  name="state"
                  disabled={!countrySelected}
                  value={currentState}
                >
                  <option></option>
                  {countrySelected
                    ? states.map((state) => (
                        <option
                          value={state.name}
                          state-id={state.id}
                          key={state.id}
                        >
                          {state.name}
                        </option>
                      ))
                    : ""}
                </Field>
                <div className="text-danger mt-2">
                  <ErrorMessage name="state" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label">İlçe</label>

                <Field
                  as="select"
                  className="form-select form-select-lg form-select-solid"
                  onChange={(e: any) => handleCityChange(e, setFieldValue)}
                  name="city"
                  disabled={!stateSelected && !countrySelected}
                  value={currentCity}
                >
                  <option></option>
                  {countrySelected && stateSelected
                    ? cities.map((city) => (
                        <option
                          value={city.name}
                          city-id={city.id}
                          key={city.id}
                        >
                          {city.name}
                        </option>
                      ))
                    : ""}
                </Field>
                <div className="text-danger mt-2">
                  <ErrorMessage name="city" />
                </div>
              </div>

              <div className="fv-row mb-10">
                <label className="d-flex align-items-center form-label">
                  <span>Adres</span>
                </label>

                <Field
                  className="form-control form-control-lg form-control-solid"
                  name="addressLine"
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="addressLine" />
                </div>

                <div className="form-text">Detaylı adres bilgisi</div>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label">Sosyal Medya Linkleri</label>

                <div className="row">
                  <div className="col-lg-6">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="instagram"
                      placeholder="Instagram"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="instagram" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="twitter"
                      placeholder="Twitter"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="twitter" />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-2">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="facebook"
                      placeholder="Facebook"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="facebook" />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-2">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="whatsapp"
                      placeholder="WhatsApp"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="whatsapp" />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-2">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="linkedin"
                      placeholder="Linkedin"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="linkedin" />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-2">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="youtube"
                      placeholder="YouTube"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="youtube" />
                    </div>
                  </div>
                  <div className="col-lg-12 mt-2">
                    <Field
                      className="form-control form-control-lg form-control-solid"
                      name="website"
                      placeholder="Website"
                    />
                    <div className="text-danger mt-2">
                      <ErrorMessage name="website" />
                    </div>
                  </div>
                  <div className="form-text">
                    Lütfen "https://" ile başlayan geçerli bir link girin
                  </div>
                </div>
              </div>
            </div>
            {/* end::Scroll */}

            {/* begin::Actions */}
            <div className="text-center pt-15">
              <button
                type="button"
                onClick={() => cancel()}
                className="btn btn-light me-3"
                data-kt-offices-modal-action="cancel"
                disabled={submittingForm || isOfficeLoading}
              >
                İptal
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                data-kt-offices-modal-action="submit"
                disabled={
                  !dirty || !isValid || isOfficeLoading || submittingForm
                }
              >
                <span className="indicator-label">Kaydet</span>
                {submittingForm && (
                  <span className="indicator-progress">
                    Lütfen Bekleyin...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
            {/* end::Actions */}
          </Form>
        )}
      </Formik>
      {isOfficeLoading && <OfficesListLoading />}
    </>
  )
}

export { OfficeEditModalForm }
