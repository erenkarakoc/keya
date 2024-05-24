import "./KYFooterTop.css"

import { KYText } from "../../../KYText/KYText"
import { KYButton } from "../../../KYButton/KYButton"
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers"
import { motion } from "framer-motion"

const KYFooterTop = () => {
  return (
    <div className="ky-footer-top">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="ky-footer-top-wrapper"
      >
        <div className="ky-footer-top-left">
          <KYText variant="subtitle" fontSize={32}>
            Gayrimenkulde doğru adrese danış
          </KYText>
          <KYText variant="paragraph" fontSize={18}>
            Yıllardır sizlere güvenle hizmet veren bir emlak firması olmanın
            mutluluğunu yaşıyoruz.
          </KYText>
          <KYButton to="/" text="Hemen Başla" secondary />
        </div>

        <div className="ky-footer-top-right">
          <img
            src={toAbsoluteUrl("media/frontend/footer/footer_top_image.png")}
            alt="Gayrimenkulde doğru adrese danış"
          />
        </div>
      </motion.div>
    </div>
  )
}

export { KYFooterTop }
