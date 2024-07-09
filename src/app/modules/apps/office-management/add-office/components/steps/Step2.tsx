import { FC, useEffect, useState, ChangeEvent } from "react"
import { Field, ErrorMessage } from "formik"
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

interface Step2Props {
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
}

const Step2: FC<Step2Props> = ({ setFieldValue }) => {
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

  const handleCountryChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCountry(e.target.value)
    setFieldValue("address.country", e.target.value)

    if (e.target.value) {
      const selectedOption = e.target.selectedOptions[0]
      const countryId = selectedOption.getAttribute("country-id")
      const statesArr = await getStatesByCountry(countryId as string)
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
      const selectedOption = e.target.selectedOptions[0]
      const stateId = selectedOption.getAttribute("state-id")
      const citiesArr = await getCitiesByState(stateId ?? "")
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

      const statesArr = await getStatesByCountry("225")
      setStates(statesArr || [])
      setCountrySelected(true)
      setCurrentCountry("225")
    }
    fetchAddress()
  }, [])

  useEffect(() => {
    setFieldValue("address.country", currentCountry as string)
  }, [setFieldValue, currentCountry])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-12">
        <h2 className="fw-bolder text-gray-900">İletişim</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Ofisinizin iletişim bilgilerini girin.
        </div>
      </div>

      <div className="fv-row mb-10">
        <label className="form-label required">E-posta Adresi</label>

        <div className="position-relative">
          <Field
            className="form-control form-control-lg form-control-solid"
            name="email"
          />
        </div>
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
                <option value={state.id} state-id={state.id} key={state.id}>
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
                <option value={city.id} city-id={city.id} key={city.id}>
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
  )
}

export { Step2 }
