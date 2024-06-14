import "./KYHero.css"

import { Link } from "react-router-dom"

import { KYText } from "../../../../components/KYText/KYText"
// import { KYBGPattern } from "../../../../components/KYBGPattern/KYBGPattern"
import { KYHeroSearchInput } from "../KYHeroSearchInput/KYHeroSearchInput"

import { motion } from "framer-motion"
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers"

const KYHero = () => {
  const bgUrl = toAbsoluteUrl("media/hero/hero-bg-1.png")

  return (
    <div className="ky-hero-section-wrapper">
      <img className="ky-hero-section-bg" src={bgUrl} draggable="false" />

      <section className="ky-hero-section">
        {/* <KYBGPattern type={1} /> */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/franchise" className="ky-hero-heading-top">
            FRANCHISE OL
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <KYText className="ky-hero-heading" variant="heading">
            Hayalindeki <span className="ky-text-highlight">mülkü bulmak</span>{" "}
            hiç bu kadar kolay olmamıştı!
          </KYText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <KYHeroSearchInput />
        </motion.div>
      </section>
    </div>
  )
}

export { KYHero }
