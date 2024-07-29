/* eslint-disable @typescript-eslint/no-explicit-any */
import "./SellRent.css"

import { useEffect, useState } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"

import { KYButton } from "../../components/KYButton/KYButton"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYCheckbox } from "../../components/KYForm/KYCheckbox/KYCheckbox"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"

import * as Yup from "yup"

import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
} from "../../../../_metronic/helpers/kyHelpers"

import { motion } from "framer-motion"
import {
  City,
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"
import { Form, Formik } from "formik"
import { newPropertyApplication } from "../../../modules/apps/property-application-management/_core/_requests"
import toast from "react-hot-toast"

interface Option {
  value: string
  text: string
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Ad alanı zorunludur"),
  lastName: Yup.string().required("Soyad alanı zorunludur"),
  phoneNumber: Yup.string().required("Telefon alanı zorunludur"),
  for: Yup.string(),
  type: Yup.string(),
  address: Yup.object({
    country: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
  }),
  agreement: Yup.string().required(),
  promotion: Yup.string(),
})

const SellRent = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [agreement, setAgreement] = useState("false")
  const [promotion, setPromotion] = useState("false")

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])

  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const handleSubmit = async (values: any) => {
    await newPropertyApplication(values)
    console.log(values)
    toast.success(
      "İlan bilgilerinizi aldık! Sizinle en kısa zamanda iletişime geçeceğiz."
    )
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const fetchCountries = async () => {
    setCountries([])
    setStates([])
    setStatesDisabled(true)

    const countriesArr: { value: string; text: string }[] = []
    const restCountries: Country[] = await getCountries()

    if (restCountries) {
      restCountries.forEach((country: Country) => {
        countriesArr.push({
          value: country.id.toString(),
          text: country.translations.tr || country.name,
        })
      })
      setCountries(countriesArr)
    }
  }

  const fetchStates = async (countryId: string) => {
    setStates([])
    setStatesDisabled(true)
    setCities([])
    setCitiesDisabled(true)

    const statesArr: { value: string; text: string }[] = []
    const restStates: State[] = await getStatesByCountry(countryId)

    if (restStates) {
      restStates.forEach((state: State) => {
        statesArr.push({
          value: state.id.toString(),
          text: state.name,
        })
      })
      setStates(statesArr)
      setStatesDisabled(false)
    }
  }

  const fetchCities = async (stateId: string) => {
    setCities([])
    setCitiesDisabled(true)

    const citiesArr: { value: string; text: string }[] = []
    const restCities: City[] = await getCitiesByState(stateId)

    if (restCities) {
      restCities.forEach((city: City) => {
        citiesArr.push({
          value: city.id.toString(),
          text: city.name,
        })
      })
      setCities(citiesArr)
      setCitiesDisabled(false)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates("225")
  }, [])

  return (
    <main className="ky-page-sell-rent">
      <KYPageHeader
        title="Sat & Kirala"
        subtitle="Aşağıdaki formu doldurarak bize 7 gün 24 saat ulaşabilir, satmayı veya kiralamayı düşündüğünüz mülk hakkında hızlı bir dönüş alabilirsiniz."
      />

      <div className="ky-page-content">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            for: "",
            type: "",
            address: {
              country: "225",
              state: "",
              city: "",
            },
            agreement: "false",
            promotion: "false",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, setFieldValue }) => {
            return (
              <Form id="sell_rent_form" className="ky-form" placeholder={null}>
                <div className="ky-form-group">
                  <motion.div
                    className="ky-form-section"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="ky-form-label">
                      Kişisel Bilgileriniz
                    </label>

                    <div className="ky-form-row">
                      <KYInput
                        id="sell_rent_firstname"
                        type="firstname"
                        placeholder="Ad"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                          setFieldValue("firstName", e.target.value)
                        }}
                        required
                      />
                      <KYInput
                        id="sell_rent_lastname"
                        type="lastname"
                        placeholder="Soyad"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value)
                          setFieldValue("lastName", e.target.value)
                        }}
                      />
                    </div>

                    <KYInput
                      id="sell_rent_phone"
                      type="phone"
                      placeholder="Telefon"
                      phoneInput="+90"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        setFieldValue("phoneNumber", e.target.value)
                      }}
                      required
                    />

                    <span className="ky-form-note">
                      Lütfen numaranın başında ülke kodu bulundurun. Örn. +90
                    </span>
                  </motion.div>

                  <motion.div
                    className="ky-form-section"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="ky-form-label">
                      Gayrimenkul Bilgileri
                    </label>

                    <KYSelect
                      id="sell_rent_for"
                      options={[
                        { value: "sale", text: "Satmak İstiyorum" },
                        { value: "rent", text: "Kiralamak İstiyorum" },
                      ]}
                      placeholder="Satılık/Kiralık"
                      onChange={(e) => {
                        setFieldValue("for", e.target.value)
                      }}
                      required
                    />

                    <KYSelect
                      id="sell_rent_for"
                      options={[
                        { value: "residence", text: "Konut" },
                        { value: "office", text: "Ticari" },
                        { value: "land", text: "Arsa" },
                        { value: "project", text: "Proje" },
                      ]}
                      placeholder="Gayrimenkul Tipi"
                      onChange={(e) => {
                        setFieldValue("type", e.target.value)
                      }}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="ky-form-section"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="ky-form-section">
                      <label className="ky-form-label">
                        Gayrimenkul Adresi
                      </label>

                      {countries && countries?.length ? (
                        <>
                          <KYSelect
                            id="franchise_country"
                            defaultValue="225"
                            options={countries}
                            onChange={(e) => {
                              fetchStates(e.target.value)
                              setFieldValue("address.country", e.target.value)
                            }}
                            placeholder="Ülke"
                          />
                          <KYSelect
                            id="franchise_state"
                            options={states}
                            placeholder="Şehir"
                            disabled={statesDisabled}
                            onChange={(e) => {
                              fetchCities(e.target.value)
                              setFieldValue("address.state", e.target.value)
                            }}
                          />
                          <KYSelect
                            id="sell_rent_city"
                            options={cities}
                            required
                            placeholder="İlçe"
                            disabled={citiesDisabled}
                            onChange={(e) => {
                              setFieldValue("address.city", e.target.value)
                            }}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    className="ky-form-section"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <KYCheckbox
                      id="franchise_agreement"
                      label={
                        <>
                          <a href="#" target="_blank">
                            KVKK Metni
                          </a>
                          'ni okudum ve onaylıyorum.
                        </>
                      }
                      value={agreement}
                      setValue={(e: any) => {
                        setAgreement(e.target.value)
                        setFieldValue("agreement", e.target.value)
                      }}
                    />
                    <KYCheckbox
                      id="franchise_promotion"
                      label="Keya Real Estate’in hizmetlerine ilişkin tanıtım amaçlı elektronik iletilere, SMS gönderilerine ve telefon aramalarına izin veriyorum."
                      value={promotion}
                      setValue={(e: any) => {
                        setPromotion(e.target.value)
                        setFieldValue("promotion", e.target.value)
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <KYButton
                      secondary
                      type="submit"
                      text="Gönder"
                      disabled={!isValid}
                    />
                  </motion.div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </main>
  )
}

export { SellRent }
