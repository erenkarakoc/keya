/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent, DragEvent } from "react"

import toast from "react-hot-toast"

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

import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "../../add-office/components/CreateOfficeWizardHelper"

const storage = getStorage(firebaseApp)
const auth = getAuth()

type Props = {
  isOfficeLoading: boolean
  office: Office
}

const editOfficeSchema = step1Schema
  .concat(step2Schema)
  .concat(step3Schema)
  .concat(step4Schema)
  .concat(step5Schema)

const OfficeEditModalForm: FC<Props> = ({ office, isOfficeLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [submittingForm, setSubmittingForm] = useState<boolean>(false)

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

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFiles(Array.from(files))
    }
  }

  const handleFiles = async (files: File[]) => {
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

    if (e.target.value) {
      const citiesArr = await getCitiesByState(e.target.value.split("|")[1])
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
        2
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
    const fetchAddress = async () => {
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

    fetchAddress()
  }, [office])

  useEffect(() => {
    setUploadedImageUrls(office.photoURLs)
    setCurrentPhoneNumber(office.phoneNumber)
  }, [office])

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
        {({ values, setFieldValue }) => (
          <Form noValidate id="office_edit_modal_form" placeholder={undefined}>
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

                <div
                  className={`ky-image-input${isDragging ? " dragging" : ""}`}
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
                      await handleFiles(Array.from(e.dataTransfer.files))
                      e.dataTransfer.clearData()
                    }
                  }}
                >
                  <input
                    id="ky-office-image-input"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => {
                      handleImageChange(e)
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
                  slides={[...uploadedImageUrls.map((url) => ({ src: url }))]}
                  plugins={[Thumbnails]}
                />

                <div className="text-danger mt-2">
                  <ErrorMessage name="photoURLs" className="mt-10" />
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Ofis Adı</label>

                <Field
                  placeholder="Ofis Adı"
                  type="text"
                  name="name"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                  disabled={submittingForm || isOfficeLoading}
                />

                <div className="text-danger mt-2">
                  <ErrorMessage name="name" />
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Ofis Hakkında Başlığı
                </label>
                <Field
                  placeholder="Başlık"
                  name="about.title"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                  disabled={submittingForm || isOfficeLoading}
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="about.title" />
                </div>

                <label className="required fw-bold fs-6 mb-2 mt-7">
                  Ofis Hakkında Açıklaması
                </label>
                <Field
                  placeholder="Açıklama"
                  name="about.description"
                  as="textarea"
                  rows={3}
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                  disabled={submittingForm || isOfficeLoading}
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="about.description" />
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Broker/Brokerlar
                </label>

                <MultiSelect
                  options={brokers}
                  defaultValue={chosenBrokers}
                  id="owners"
                  name="owners"
                  notFoundText="Aramanızla eşleşen bir Broker bulunamadı."
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  disabled={submittingForm || isOfficeLoading}
                  placeholder="Broker/Brokerlar"
                />

                <div className="text-danger mt-2">
                  <ErrorMessage name="owners" />
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">E-posta</label>

                <Field
                  placeholder="Email"
                  type="email"
                  name="email"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                  value={values.email}
                  disabled={submittingForm || isOfficeLoading}
                />
                <div className="text-danger mt-2">
                  <ErrorMessage name="email" />
                </div>
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
                        value={(country.translations.tr || country.name) + "|" + country.id}
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
                  <div className="form-text">Lütfen geçerli bir link girin</div>
                </div>
              </div>
            </div>

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
                disabled={isOfficeLoading || submittingForm}
              >
                <span className="indicator-label">Kaydet</span>
                {submittingForm && (
                  <span className="indicator-progress">
                    Kaydediliyor...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {isOfficeLoading && <OfficesListLoading />}
    </>
  )
}

export { OfficeEditModalForm }
