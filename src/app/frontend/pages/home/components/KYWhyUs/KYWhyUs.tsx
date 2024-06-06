import "./KYWhyUs.css"

import { KYBGPattern } from "../../../../components/KYBGPattern/KYBGPattern"
import { KYText } from "../../../../components/KYText/KYText"

import { motion } from "framer-motion"

interface KYWhyUsProps {
  ref?: React.RefObject<HTMLElement>
}

const KYWhyUs: React.FC<KYWhyUsProps> = ({ ref }) => {
  const whyUsHidden = { opacity: 0, x: -30 }
  const whyUsVisible = { opacity: 1, x: 0 }

  return (
    <section className="ky-why-us-section" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <KYText className="ky-section-title-center" variant="title">
          Peki, <span className="ky-text-highlight">neden</span> Keya ile
          çalışmalıyım?
        </KYText>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="ky-why-us-wrapper">
          <motion.div
            initial={whyUsHidden}
            whileInView={whyUsVisible}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="ky-why-us-item"
          >
            <div className="ky-why-us-item-title">
              Profesyonel ve Dürüst İş Anlayışı
            </div>
            <div className="ky-why-us-item-desc">
              Her aşamada doğru bilgi ve danışmanlık sunarak güvenilir bir ortak
              olmayı hedefliyoruz.
            </div>
          </motion.div>
          <motion.div
            initial={whyUsHidden}
            whileInView={whyUsVisible}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="ky-why-us-item"
          >
            <div className="ky-why-us-item-title">
              Toplumsal Sorumluluk Bilinci
            </div>
            <div className="ky-why-us-item-desc">
              Aktif olarak toplumsal projelere katılıyor ve emlak sektörüne
              öncülük ediyoruz.
            </div>
          </motion.div>
          <motion.div
            initial={whyUsHidden}
            whileInView={whyUsVisible}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="ky-why-us-item"
          >
            <div className="ky-why-us-item-title">
              Güvenilir ve Şeffaf Hizmet
            </div>
            <div className="ky-why-us-item-desc">
              Hayallerinizdeki evi bulmak için şeffaf bir emlak firması olan
              Keya’yı seçin.
            </div>
          </motion.div>
        </div>
      </motion.div>

      <KYBGPattern type={3} />
    </section>
  )
}

export { KYWhyUs }
