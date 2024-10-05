/* eslint-disable @typescript-eslint/no-explicit-any */
import "./About.css"
import { KYPageHeader } from "../../components/KYPageHeader/KYPageHeader"
import { KYText } from "../../components/KYText/KYText"

import { motion } from "framer-motion"
import { toAbsoluteUrl } from "../../../../_metronic/helpers"
import { KYButton } from "../../components/KYButton/KYButton"

const About = () => {
  return (
    <main className="ky-page-about">
      <KYPageHeader
        title="Hakkımızda"
        subtitle="Uzun yıllardır gayrimenkul sektöründe etkin pazarlama ve danışmanlık hizmetleri vermekteyiz.
        Giderek büyümekte olan hedefler ile müşterilerimize en iyi hizmeti vermek adına çalışıyoruz."
      />

      <div className="ky-page-content">
        <div className="ky-about-row">
          <div className="ky-about-left">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <img
                src={toAbsoluteUrl("media/frontend/about/franchise_image.svg")}
                alt=""
              />
            </motion.div>
          </div>
          <div className="ky-about-right">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <KYText
                className="ky-section-title-left"
                variant="uppercase-spaced"
              >
                FRANCHISE
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <KYText className="ky-section-title-left" variant="title">
                Keya <span className="ky-text-highlight">güvencesi</span> ile
                kendi işinizi kurun.
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <KYText className="ky-section-desc-left" variant="paragraph">
                Yıllardır sizlere güvenle hizmet veren bir emlak firması olmanın
                mutluluğunu yaşıyoruz. Müşterilerimizin güvenli bir
                ortamdahayallerini gerçeğe dönüştürüyoruz.
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <KYButton
                text="Franchise Başvurusu Yap"
                secondary
                link
                to="/franchise"
              />
            </motion.div>
          </div>
        </div>

        <div className="ky-about-row">
          <div className="ky-about-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <KYText
                className="ky-section-title-left"
                variant="uppercase-spaced"
              >
                AKADEMİ
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <KYText className="ky-section-title-left" variant="title">
                Ekibimize katıl,{" "}
                <span className="ky-text-highlight">eğitimlerimizden</span>{" "}
                faydalan.
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <KYText className="ky-section-desc-left" variant="paragraph">
                Keya'nın yıllar süren deneyimlerinden, tanınırlığından ve
                güvenilirliğinden faydalanarak, seçtiğiniz alanda emlak eğitimi
                ve akademisi hizmeti sunmak ister misiniz? Hemen iletişime geç
                ve ekibimize katıl!
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <KYButton text="Danışman Ol" secondary link to="/kariyer" />
            </motion.div>
          </div>
          <div className="ky-about-right">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <img
                src={toAbsoluteUrl("media/frontend/about/academy_image.svg")}
                alt=""
              />
            </motion.div>
          </div>
        </div>

        <div className="ky-about-row">
          <div className="ky-about-left">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <img
                src={toAbsoluteUrl("media/frontend/about/crew_image.svg")}
                alt=""
              />
            </motion.div>
          </div>
          <div className="ky-about-right">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <KYText
                className="ky-section-title-left"
                variant="uppercase-spaced"
              >
                EKİBİMİZ
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <KYText className="ky-section-title-left" variant="title">
                Sana en uygun{" "}
                <span className="ky-text-highlight">danışmanı</span> seç ve
                başla.
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <KYText className="ky-section-desc-left" variant="paragraph">
                Alanında uzman danışmanlarımızdan birini seç, profesyonel
                rehberliğin keyfini çıkar! Keya'nın yıllar boyunca edindiği
                deneyimler tüm danışmanlar tarafından benimsenmiş ve
                uygulanmaktadır.
              </KYText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <KYButton
                text="Danışmanlarımız"
                secondary
                link
                to="/danismanlarimiz"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

export { About }
