/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Franchise.css"

import { useEffect, useState } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYFranchiseFeatures } from "./components/KYFranchiseFeatures"

import { KYText } from "../../components/KYText/KYText"
import { KYButton } from "../../components/KYButton/KYButton"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYCheckbox } from "../../components/KYForm/KYCheckbox/KYCheckbox"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"

import * as Yup from "yup"

import {
  getCountries,
  getStatesByCountry,
} from "../../../../_metronic/helpers/kyHelpers"

import { motion } from "framer-motion"
import { Formik, Form } from "formik"
import { newFranchiseApplication } from "../../../modules/apps/franchise-management/_core/_requests"
import toast from "react-hot-toast"
import {
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"

interface Option {
  value: string
  text: string
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Ad alanı zorunludur"),
  lastName: Yup.string().required("Soyad alanı zorunludur"),
  phoneNumber: Yup.string().required("Telefon alanı zorunludur"),
  occupation: Yup.string(),
  address: Yup.object({
    country: Yup.string(),
    state: Yup.string(),
  }),
  agreement: Yup.string().required(),
  promotion: Yup.string(),
})

const Franchise = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [occupation, setOccupation] = useState("")
  const [agreement, setAgreement] = useState("false")
  const [promotion, setPromotion] = useState("false")

  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])

  const [statesDisabled, setStatesDisabled] = useState(true)

  const handleSubmit = async (values: any) => {
    await newFranchiseApplication(values)
    toast.success(
      "Franchise başvurunuzu aldık! Sizinle en kısa zamanda iletişime geçeceğiz."
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

  useEffect(() => {
    fetchCountries()
    fetchStates("225")
  }, [])

  return (
    <main className="ky-page-franchise">
      <KYPageHeader
        title="Franchise"
        subtitle="Gayrimenkul sektörünün önemli bir parçası olmak ve Keya’nın eşsiz avantajlarından faydalanmak için hemen başlayın."
      />

      <div className="ky-page-content">
        <KYFranchiseFeatures />

        <div className="ky-franchise-introduction">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <KYText className="ky-section-title-center" variant="title">
              Keya <span className="ky-text-highlight">güvencesi</span> ile
              kendi işinizi kurun.
            </KYText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <KYText variant="paragraph" textAlign="center">
              Keya'nın yıllar boyunca edindiği deneyimlerinden, tanınırlığından
              ve güveninden yararlanarak, seçtiğiniz semtte gayrimenkul
              danışmanlığı hizmeti sunmak ister misiniz? Yapmanız gereken tek
              şey ilgili formu doldurmak. En kısa sürede sizinle iletişime
              geçeceğiz!
            </KYText>
          </motion.div>
        </div>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            occupation: "",
            address: {
              country: "225",
              state: "",
            },
            agreement: "false",
            promotion: "false",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, setFieldValue }) => {
            return (
              <Form id="franchise_form" className="ky-form" placeholder={null}>
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
                        id="franchise_firstname"
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
                        id="franchise_lastname"
                        type="lastname"
                        placeholder="Soyad"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value)
                          setFieldValue("lastName", e.target.value)
                        }}
                        required
                      />
                    </div>

                    <KYInput
                      id="franchise_phone"
                      type="phone"
                      placeholder="Telefon"
                      phoneInput="+90"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setFieldValue("phoneNumber", e.target.value)
                      }}
                      required
                    />
                    <KYInput
                      id="franchise_occupation"
                      type="text"
                      placeholder="Mesleğiniz"
                      value={occupation}
                      onChange={(e) => {
                        setOccupation(e.target.value)
                        setFieldValue("occupation", e.target.value)
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="ky-form-section"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="ky-form-label">Adres Bilgileriniz</label>

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
                        setFieldValue("address.state", e.target.value)
                      }}
                    />
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
                    transition={{ delay: 0.7 }}
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

export { Franchise }
