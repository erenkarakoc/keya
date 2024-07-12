import { FC, useEffect, useState, ChangeEvent } from "react"
import { Field, ErrorMessage } from "formik"
import { toAbsoluteUrl } from "../../../../../../../_metronic/helpers"
import { AsYouType } from "libphonenumber-js"

import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  generateRandomName,
  slugify,
} from "../../../../../../../_metronic/helpers/kyHelpers"
import {
  Country,
  State,
  City,
} from "../../../../../../../_metronic/helpers/address-helper/_models"

import toast from "react-hot-toast"

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { firebaseApp } from "../../../../../../../firebase/BaseConfig"
import imageCompression from "browser-image-compression"

const storage = getStorage(firebaseApp)

interface Step2Props {
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
  values: {
    firstName: string
    lastName: string
  }
}

const Step2: FC<Step2Props> = ({ setFieldValue, values }) => {
  const [countries, setCountries] = useState<Country[]>([])

  const [currentCountry, setCurrentCountry] = useState<string | null>("255")
  const [currentState, setCurrentState] = useState<string | null>("")
  const [currentCity, setCurrentCity] = useState<string | null>("")

  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [countrySelected, setCountrySelected] = useState<boolean>(false)
  const [stateSelected, setStateSelected] = useState<boolean>(false)

  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(
    "+90"
  )
  const [countryCode, setCountryCode] = useState<string | null>("TR")

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg")

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
            values.firstName + "-" + values.lastName
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

  const handleImageDelete = async () => {
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

  const handleCountryChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCountry(e.target.value)
    setFieldValue("address.country", e.target.value)

    if (e.target.value) {
      const statesArr = await getStatesByCountry(e.target.value.split("|")[1])
      setStates(statesArr || [])
      setCountrySelected(true)
    } else {
      setStates([])
      setCountrySelected(false)
    }
  }

  const handleStateChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentState(e.target.value)
    setFieldValue("address.state", e.target.value)

    if (e.target.value) {
      const citiesArr = await getCitiesByState(e.target.value.split("|")[1])
      setCities(citiesArr || [])
      setStateSelected(true)
    } else {
      setCities([])
      setStateSelected(false)
    }
  }

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCity(e.target.value)
    setFieldValue("address.city", e.target.value)
  }

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const asYouType = new AsYouType()
    const formatted = asYouType.input(e.target.value)
    const countryCode = asYouType.getNumber()?.country

    setCurrentPhoneNumber(formatted)
    setFieldValue("phoneNumber", formatted)
    setCountryCode(countryCode ? countryCode : "")
  }

  useEffect(() => {
    const fetchAddress = async () => {
      const data = await getCountries()
      setCountries(data)
      setCurrentCountry("225")
      setFieldValue("address.country", "225")

      const statesArr = await getStatesByCountry("225")
      setStates(statesArr || [])
      setCountrySelected(true)
    }

    fetchAddress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-12">
        <h2 className="fw-bolder text-gray-900">Detaylar</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Kullanıcının detaylı bilgilerini girin. Lütfen girdiğiniz bilgilerin
          doğruluğundan emin olun.
        </div>
      </div>

      {/* begin::Input group */}
      <div className="fv-row mb-10">
        <label className="form-label mb-5 w-100 required">Fotoğraf</label>

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
              onChange={handleImageChange}
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
              onClick={handleImageDelete}
            >
              <i className="bi bi-x fs-7 text-gray-600"></i>
            </span>
          )}
          {/* end::Cancel */}
        </div>
        {/* end::Image input */}

        {/* begin::Hint */}
        <div className="form-text">
          İzin verilen dosya türleri: png, jpg, jpeg.
        </div>
        {/* end::Hint */}

        <div className="text-danger mt-2">
          <ErrorMessage name="photoURL" className="mt-10" />
        </div>

        {uploadingImage ? (
          <div className="d-flex align-items-center gap-5 mt-5">
            <div className="text-gray-600 fw-semibold fs-7">
              <span className="spinner-border spinner-border-lg"></span>
            </div>
            <span className="text-gray-600">Görsel karşıya yükleniyor.</span>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* end::Input group */}

      <div className="fv-row mb-10">
        <label className="form-label">Telefon Numarası</label>

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
            style={{ top: "50%", transform: "translateY(-50%)", left: "13px" }}
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
          onChange={handleCountryChange}
          name="address.country"
          value={currentCountry}
        >
          <option></option>
          {countries &&
            countries.map((country) => (
              <option
                value={
                  (country.translations.tr || country.name) + "|" + country.id
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

      <div className="fv-row mb-10">
        <label className="form-label">İl</label>

        <Field
          as="select"
          className="form-select form-select-lg form-select-solid"
          onChange={handleStateChange}
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

      <div className="fv-row mb-10">
        <label className="form-label">İlçe</label>

        <Field
          as="select"
          className="form-select form-select-lg form-select-solid"
          onChange={handleCityChange}
          name="address.city"
          disabled={!stateSelected && !countrySelected}
          value={currentCity}
        >
          <option></option>
          {countrySelected && stateSelected
            ? cities.map((city) => (
                <option
                  value={city.name + "|" + city.id}
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
  )
}

export { Step2 }
