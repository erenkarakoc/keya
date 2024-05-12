import { FC, useEffect, useState, ChangeEvent } from "react"
import { Field, ErrorMessage } from "formik"
import { toAbsoluteUrl } from "../../../../../../../_metronic/helpers"
import { AsYouType } from "libphonenumber-js"

import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
} from "../../../../../../../_metronic/helpers/kyHelpers"
import {
  Country,
  State,
  City,
} from "../../../../../../../_metronic/helpers/address-helper/_models"

const Step2: FC = () => {
  const [countries, setCountries] = useState<Country[]>([])

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
      const selectedFile = e.target.files[0]
      setUploadedImageUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleImageRemove = () => {
    setUploadedImageUrl(null)
  }

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const statesArr = getStatesByCountry(parseInt(e.target.value))
      setStates(statesArr || [])
      setCountrySelected(true)
    } else {
      setStates([])
      setCountrySelected(false)
    }
  }

  const handleStateChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const citiesArr = getCitiesByState(parseInt(e.target.value))
      setCities(citiesArr || [])
      setStateSelected(true)
    } else {
      setCities([])
      setStateSelected(false)
    }
  }

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const asYouType = new AsYouType()
    const formatted = asYouType.input(e.target.value)
    const countryCode = asYouType.getNumber()?.country

    setCurrentPhoneNumber(formatted || "")
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
            {/* <input type="hidden" name="avatar_remove" /> */}
          </label>
          {/* end::Label */}

          {/* begin::Cancel */}
          <span
            className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
            data-kt-image-input-action="cancel"
            data-bs-toggle="tooltip"
          >
            <i className="bi bi-x fs-2"></i>
          </span>
          {/* end::Cancel */}

          {/* begin::Remove */}
          <span
            className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
            data-kt-image-input-action="remove"
            data-bs-toggle="tooltip"
            title="Fotoğrafı Sil"
            onClick={handleImageRemove}
          >
            <i className="bi bi-x fs-2"></i>
          </span>
          {/* end::Remove */}
        </div>
        {/* end::Image input */}
        {/* begin::Hint */}
        <div className="form-text">
          İzin verilen dosya türleri: png, jpg, jpeg.
        </div>
        {/* end::Hint */}
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
            style={{ paddingLeft: "35px" }}
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
          value={225}
        >
          <option></option>
          {countries &&
            countries.map((country) => (
              <option value={country.id} key={country.id}>
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
        >
          <option></option>
          {countrySelected
            ? states.map((state) => (
                <option value={state.id} key={state.id}>
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
          name="city"
          disabled={!stateSelected && !countrySelected}
        >
          <option></option>
          {countrySelected && stateSelected
            ? cities.map((city) => (
                <option value={city.id} key={city.id}>
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
