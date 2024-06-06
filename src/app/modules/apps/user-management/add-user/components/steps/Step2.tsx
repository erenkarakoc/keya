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

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { firebaseApp } from "../../../../../../../firebase/BaseConfig"

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

  const [currentCountry, setCurrentCountry] = useState<string | null>("")
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

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg")

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const fileSizeInMB = file.size / (1024 * 1024)

      if (fileSizeInMB > 2) {
        toast.error(
          `${file.name} adlı dosya yüklenemedi. Dosya boyutu 2 MB'den küçük olmalıdır!`
        )
        setUploadedImageUrl(null)
        return
      }

      try {
        const randomName = generateRandomName()
        const storageRef = ref(
          storage,
          `images/users/${slugify(
            values.firstName + "-" + values.lastName
          )}-${randomName}`
        )
        await uploadBytes(storageRef, e.target.files[0])
        const downloadURL = await getDownloadURL(storageRef)
        setUploadedImageUrl(downloadURL)
        setFieldValue("photoURL", downloadURL)
      } catch (error) {
        console.error("Error uploading image:", error)
        setUploadedImageUrl(null)
      }
    }
  }

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCountry(e.target.value)
    setFieldValue("country", e.target.value)

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

  const handleStateChange = async (e: ChangeEvent<HTMLSelectElement>) => {
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

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCity(e.target.value)
    setFieldValue("city", e.target.value)
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
    const data = getCountries()
    setCountries(data)

    const statesArr = getStatesByCountry(225)
    setStates(statesArr || [])
    setCountrySelected(true)
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
      </div>
      {/* end::Input group */}

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
        <label className="form-label">Ülke</label>

        <Field
          as="select"
          className="form-select form-select-lg form-select-solid"
          onChange={handleCountryChange}
          name="country"
          value={currentCountry}
        >
          <option></option>
          {countries &&
            countries.map((country) => (
              <option
                value={country.name}
                country-id={country.id}
                key={country.id}
              >
                {country.translations.tr}
              </option>
            ))}
        </Field>
        <div className="text-danger mt-2">
          <ErrorMessage name="city" />
        </div>
      </div>

      <div className="fv-row mb-10">
        <label className="form-label">İl</label>

        <Field
          as="select"
          className="form-select form-select-lg form-select-solid"
          onChange={handleStateChange}
          name="state"
          disabled={!countrySelected}
          value={currentState}
        >
          <option></option>
          {countrySelected
            ? states.map((state) => (
                <option value={state.name} state-id={state.id} key={state.id}>
                  {state.name}
                </option>
              ))
            : ""}
        </Field>
        <div className="text-danger mt-2">
          <ErrorMessage name="city" />
        </div>
      </div>

      <div className="fv-row mb-10">
        <label className="form-label">İlçe</label>

        <Field
          as="select"
          className="form-select form-select-lg form-select-solid"
          onChange={handleCityChange}
          name="city"
          disabled={!stateSelected && !countrySelected}
          value={currentCity}
        >
          <option></option>
          {countrySelected && stateSelected
            ? cities.map((city) => (
                <option value={city.name} city-id={city.id} key={city.id}>
                  {city.name}
                </option>
              ))
            : ""}
        </Field>
        <div className="text-danger mt-2">
          <ErrorMessage name="district" />
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
    </div>
  )
}

export { Step2 }
