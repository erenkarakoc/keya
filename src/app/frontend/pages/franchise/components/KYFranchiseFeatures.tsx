import "./KYFranchiseFeatures.css"

import KYIcon from "../../../components/KYIcon/KYIcon"

import { motion } from "framer-motion"

const KYFranchiseFeatures = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="ky-franchise-features">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="ky-franchise-feature">
          <div className="ky-franchise-feature-icon">
            <KYIcon name="badge" />
          </div>
          <div className="ky-franchise-feature-title">
            {currentYear - 2009}+
          </div>
          <div className="ky-franchise-feature-desc">Yıllık deneyim</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="ky-franchise-feature">
          <div className="ky-franchise-feature-icon">
            <KYIcon name="city" />
          </div>
          <div className="ky-franchise-feature-title">5</div>
          <div className="ky-franchise-feature-desc">Şehir</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="ky-franchise-feature">
          <div className="ky-franchise-feature-icon">
            <KYIcon name="office" />
          </div>
          <div className="ky-franchise-feature-title">7</div>
          <div className="ky-franchise-feature-desc">Ofis</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div className="ky-franchise-feature">
          <div className="ky-franchise-feature-icon">
            <KYIcon name="agent" />
          </div>
          <div className="ky-franchise-feature-title">74</div>
          <div className="ky-franchise-feature-desc">Danışman</div>
        </div>
      </motion.div>
    </div>
  )
}

export { KYFranchiseFeatures }
