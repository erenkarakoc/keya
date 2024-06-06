import "./SellRent.css"

import { useEffect, useState } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"

import { KYButton } from "../../components/KYButton/KYButton"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYCheckbox } from "../../components/KYForm/KYCheckbox/KYCheckbox"
import { KYRadio } from "../../components/KYForm/KYRadio/KYRadio"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"

import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
} from "../../../../_metronic/helpers/kyHelpers"

import { motion } from "framer-motion"

interface Option {
  value: string
  text: string
}

const SellRent = () => {
  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])
  const [statesDisabled, setStatesDisabled] = useState(true)
  const [citiesDisabled, setCitiesDisabled] = useState(true)

  const fetchCountries = () => {
    try {
      const countriesData = getCountries()
      const countriesArr = countriesData.map((country) => ({
        value: country.id.toString(),
        text: country.translations.tr || "",
      }))
      setCountries(countriesArr)
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  const fetchStates = (countryId: number) => {
    if (countryId) {
      try {
        const statesData = getStatesByCountry(countryId)

        if (statesData) {
          const statesArr = statesData.map((state) => ({
            value: state.id.toString(),
            text: state.name || "",
          }))

          setStatesDisabled(false)
          setStates(statesArr)

          setCities([])
        } else {
          console.log("Şehir bulunamadı")
        }
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    } else {
      setStates([])
      setStatesDisabled(true)

      setCities([])
      setCitiesDisabled(true)
    }
  }

  const fetchCities = (stateId: number) => {
    if (stateId) {
      try {
        const citiesData = getCitiesByState(stateId)

        if (citiesData) {
          const citiesArr = citiesData.map((state) => ({
            value: state.id.toString(),
            text: state.name || "",
          }))

          setCitiesDisabled(false)
          setCities(citiesArr)
        } else {
          console.log("İlçe bulunamadı")
        }
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    } else {
      setCities([])
      setCitiesDisabled(true)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates(225)
  }, [])

  return (
    <main className="ky-page-sell-rent">
      <KYPageHeader
        title="Sat & Kirala"
        subtitle="Aşağıdaki formu doldurarak bize 7 gün 24 saat ulaşabilir, satmayı veya kiralamayı düşündüğünüz mülk hakkında hızlı bir dönüş alabilirsiniz."
      />

      <div className="ky-page-content">
        <form action="" id="sell_rent_form" className="ky-form">
          <div className="ky-form-group">
            <motion.div
              className="ky-form-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <label className="ky-form-label">Kişisel Bilgileriniz</label>

              <div className="ky-form-row">
                <KYInput
                  id="sell_rent_firstname"
                  type="firstname"
                  placeholder="Ad"
                  required
                />
                <KYInput
                  id="sell_rent_lastname"
                  type="lastname"
                  placeholder="Soyad"
                  required
                />
              </div>

              <KYInput
                id="sell_rent_phone"
                type="phone"
                placeholder="Telefon"
                phoneInput="+90"
                required
              />
            </motion.div>

            <motion.div
              className="ky-form-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <label className="ky-form-label">Gayrimenkul Bilgileri</label>

              <KYSelect
                id="sell_rent_for"
                options={[
                  { value: "for-sale", text: "Satmak İstiyorum" },
                  { value: "for-rent", text: "Kiralamak İstiyorum" },
                ]}
                placeholder="Satılık/Kiralık"
                required
              />

              <KYSelect
                id="sell_rent_for"
                options={[
                  { value: "sell_rent_house", text: "Konut" },
                  { value: "sell_rent_project", text: "Proje" },
                  { value: "sell_rent_shop", text: "Ticari" },
                  { value: "sell_rent_land", text: "Arsa" },
                ]}
                placeholder="Konut Tipi"
                required
              />

              <div className="ky-form-row mt-6">
                <KYRadio
                  id="sell_rent_house"
                  name="sell_rent_type"
                  label="Konut"
                />
                <KYRadio
                  id="sell_rent_project"
                  name="sell_rent_type"
                  label="Proje"
                />
                <KYRadio
                  id="sell_rent_shop"
                  name="sell_rent_type"
                  label="Ticari"
                />
                <KYRadio
                  id="sell_rent_land"
                  name="sell_rent_type"
                  label="Arsa"
                />
              </div>
            </motion.div>

            <motion.div
              className="ky-form-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="ky-form-section">
                <label className="ky-form-label">Gayrimenkul Adresi</label>

                <KYSelect
                  id="sell_rent_country"
                  defaultValue="225"
                  options={countries}
                  onChange={(e) => fetchStates(parseInt(e.target.value))}
                  placeholder="Ülke"
                />
                <KYSelect
                  id="sell_rent_state"
                  options={states}
                  onChange={(e) => fetchCities(parseInt(e.target.value))}
                  placeholder="Şehir"
                  disabled={statesDisabled}
                />
                <KYSelect
                  id="sell_rent_city"
                  options={cities}
                  required
                  placeholder="İlçe"
                  disabled={citiesDisabled}
                />
              </div>
            </motion.div>

            <motion.div
              className="ky-form-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <KYCheckbox
                id="sell_rent_agreement"
                label={
                  <>
                    <a href="#" target="_blank">
                      KVKK Metni
                    </a>
                    'ni okudum ve onaylıyorum.
                  </>
                }
                required
              />
              <KYCheckbox
                id="sell_rent_promotion"
                label="Keya Real Estate’in hizmetlerine ilişkin tanıtım amaçlı elektronik iletilere, SMS gönderilerine ve telefon aramalarına izin veriyorum."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <KYButton secondary type="submit" text="Gönder" />
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  )
}

export { SellRent }
