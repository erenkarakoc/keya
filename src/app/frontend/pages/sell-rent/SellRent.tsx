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
import {
  City,
  Country,
  State,
} from "../../../../_metronic/helpers/address-helper/_models"

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

                {countries && countries?.length ? (
                  <>
                    <KYSelect
                      id="sell_rent_country"
                      defaultValue="225"
                      options={countries}
                      onChange={(e) => {
                        fetchStates(e.target.value)
                      }}
                      placeholder="Ülke"
                    />
                    <KYSelect
                      id="sell_rent_state"
                      options={states}
                      onChange={(e) => {
                        fetchCities(e.target.value)
                      }}
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
