import "./Franchise.css"

import { useEffect, useState } from "react"

import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYFranchiseFeatures } from "./components/KYFranchiseFeatures"

import { KYText } from "../../components/KYText/KYText"
import { KYButton } from "../../components/KYButton/KYButton"
import { KYInput } from "../../components/KYForm/KTInput/KYInput"
import { KYCheckbox } from "../../components/KYForm/KYCheckbox/KYCheckbox"
import { KYSelect } from "../../components/KYForm/KYSelect/KYSelect"

import {
  getCountries,
  getStatesByCountry,
} from "../../../../_metronic/helpers/kyHelpers"

import { motion } from "framer-motion"

interface Option {
  value: string
  text: string
}

const Franchise = () => {
  const [countries, setCountries] = useState<Option[]>([])
  const [states, setStates] = useState<Option[]>([])
  const [statesDisabled, setStatesDisabled] = useState(true)

  const fetchCountries = async () => {
    try {
      const countriesData = await getCountries()
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
        } else {
          console.log("Şehir bulunamadı")
        }
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    } else {
      setStates([])
      setStatesDisabled(true)
    }
  }

  useEffect(() => {
    fetchCountries()
    fetchStates(225)
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

        <form action="" id="franchise_form" className="ky-form">
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
                  id="franchise_firstname"
                  type="firstname"
                  placeholder="Ad"
                  required
                />
                <KYInput
                  id="franchise_lastname"
                  type="lastname"
                  placeholder="Soyad"
                  required
                />
              </div>

              <KYInput
                id="franchise_phone"
                type="phone"
                placeholder="Telefon"
                phoneInput="+90"
                required
              />
              <KYInput
                id="franchise_job"
                type="text"
                placeholder="Mesleğiniz"
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
                onChange={(e) => fetchStates(parseInt(e.target.value))}
                placeholder="Ülke"
                required
              />
              <KYSelect
                id="franchise_city"
                options={states}
                placeholder="Şehir"
                disabled={statesDisabled}
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
                required
              />
              <KYCheckbox
                id="franchise_promotion"
                label="Keya Real Estate’in hizmetlerine ilişkin tanıtım amaçlı elektronik iletilere, SMS gönderilerine ve telefon aramalarına izin veriyorum."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <KYButton secondary type="submit" text="Gönder" />
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  )
}

export { Franchise }
