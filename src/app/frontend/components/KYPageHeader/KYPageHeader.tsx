import "./KYPageHeader.css"

import { KYText } from "../KYText/KYText"
import { KYBGPattern } from "../KYBGPattern/KYBGPattern"

import { motion } from "framer-motion"

interface KYPageHeaderProps {
  title: string
  subtitle: string
}

const KYPageHeader: React.FC<KYPageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="ky-page-header">
      <KYBGPattern type={1} height={722} width={722} />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <KYText variant="title" fontWeight={600}>
          {title}
        </KYText>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <KYText variant="subtitle" fontSize={20}>
          {subtitle}
        </KYText>
      </motion.div>
    </div>
  )
}

export { KYPageHeader }
