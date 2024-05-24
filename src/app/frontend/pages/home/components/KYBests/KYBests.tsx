import "./KYBests.css"

import { KYBGPattern } from "../../../../components/KYBGPattern/KYBGPattern"
import { KYText } from "../../../../components/KYText/KYText"

import { motion } from "framer-motion"

import { toAbsoluteUrl } from "../../../../../../_metronic/helpers"

const KYBests = () => {
  const bestsHidden = { opacity: 0, y: 20 }
  const bestsVisible = { opacity: 1, y: 0 }

  return (
    <section className="ky-bests-section">
      <div className="ky-bests-wrapper">
        <motion.div className="ky-bests-item-wrapper" initial={bestsHidden} whileInView={bestsVisible} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <a href="#" target="_blank" className="ky-bests-item">
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Mayıs Ayının</span> En Başarılı
              Ofisi
            </KYText>
            <div className="ky-bests-content">
              <div className="ky-bests-image">
                Keya <span>Gold</span>
              </div>
              <div className="ky-bests-info">
                <div className="ky-bests-name">Keya Gold</div>
                <div className="ky-bests-desc">Kırıkkale</div>
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div className="ky-bests-item-wrapper" initial={bestsHidden} whileInView={bestsVisible} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <a href="#" target="_blank" className="ky-bests-item">
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Mayıs Ayının</span> En Başarılı
              Danışmanı
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

        <motion.div className="ky-bests-item-wrapper" initial={bestsHidden} whileInView={bestsVisible} viewport={{ once: true }} transition={{ delay: 0.6 }}>
          <a href="#" target="_blank" className="ky-bests-item">
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Geçen Haftanın</span> En Başarılı
              Danışmanı
            </KYText>
            <div className="ky-bests-content">
              <div className="ky-bests-image">
                <img
                  src={toAbsoluteUrl("media/avatars/bahadir.jpg")}
                  alt="Bahadır Angun"
                />
              </div>
              <div className="ky-bests-info">
                <div className="ky-bests-name">Bahadır Angun</div>
                <div className="ky-bests-desc">Keya Ankara</div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>

      <KYBGPattern type={9} />
    </section>
  )
}

export { KYBests }
