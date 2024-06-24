import "./KYBests.css"

import { KYText } from "../../../../components/KYText/KYText"

import { motion } from "framer-motion"

import { toAbsoluteUrl } from "../../../../../../_metronic/helpers"
import { KYOfficeImage } from "../../../../components/KYOfficeImage/KYOfficeImage"

const KYBests = () => {
  const bestsHidden = { opacity: 0, y: 20 }
  const bestsVisible = { opacity: 1, y: 0 }

  return (
    <section className="ky-bests-section">
      <div className="ky-bests-wrapper">
        <motion.div
          className="ky-bests-item-wrapper"
          initial={bestsHidden}
          whileInView={bestsVisible}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a href="/ofis-detayi/B3U0cyMyf0n4sOz4YpSw" className="ky-bests-item">
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Mayıs Ayının</span> En
              Başarılı Ofisi
            </KYText>
            <div className="ky-bests-content">
              <KYOfficeImage height={57} width={57} officeId="Gold" />
              <div className="ky-bests-info">
                <div className="ky-bests-name">Keya Gold</div>
                <div className="ky-bests-desc">Kırıkkale</div>
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div
          className="ky-bests-item-wrapper"
          initial={bestsHidden}
          whileInView={bestsVisible}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="/kullanici-detayi/eVG5h7VPOeSJlVCs98x6olPyQ3l1/"
            className="ky-bests-item"
          >
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Mayıs Ayının</span> En
              Başarılı Danışmanı
            </KYText>
            <div className="ky-bests-content">
              <div className="ky-bests-image">
                <img
                  src={toAbsoluteUrl("media/avatars/300-17.jpg")}
                  alt="Görkem Aysert"
                />
              </div>
              <div className="ky-bests-info">
                <div className="ky-bests-name">Görkem Aysert</div>
                <div className="ky-bests-desc">Keya Vera</div>
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div
          className="ky-bests-item-wrapper"
          initial={bestsHidden}
          whileInView={bestsVisible}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="/kullanici-detayi/GdnjRpbbbGhMcTa9RoKtsI1ostM2/"
            className="ky-bests-item"
          >
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Geçen Haftanın</span> En
              Başarılı Danışmanı
            </KYText>
            <div className="ky-bests-content">  
              <div className="ky-bests-image">
                <img
                  src={toAbsoluteUrl("media/avatars/gulnur.jpg")}
                  alt="Gülnur Karabacak"
                />
              </div>
              <div className="ky-bests-info">
                <div className="ky-bests-name">Gülnur Karabacak</div>
                <div className="ky-bests-desc">Keya Kıbrıs</div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export { KYBests }
