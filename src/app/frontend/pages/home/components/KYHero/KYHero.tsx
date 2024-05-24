import "./KYHero.css"

import { Link } from "react-router-dom"
import { useState } from "react"

import { KYText } from "../../../../components/KYText/KYText"
import { KYBGPattern } from "../../../../components/KYBGPattern/KYBGPattern"
import { KYHeroSearchInput } from "../KYHeroSearchInput/KYHeroSearchInput"

import { motion } from "framer-motion"

const KYHero = () => {
  const [moreIconColor, setMoreIconColor] = useState("#6c6c6c")

  return (
    <section className="ky-hero-section">
      <KYBGPattern type={1} />

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

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="ky-hero-caption"
      >
        <KYText variant="caption">
          Franchise programımıza katıl, kendi işinin sahibi ol!{" "}
          <Link
            to="/franchise"
            className="ky-hero-caption-more"
            onMouseOver={() => setMoreIconColor("#8f8f8f")}
            onMouseOut={() => {
              setMoreIconColor("#6c6c6c")
            }}
          >
            Daha fazla bilgi
          </Link>
          <svg
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5654 5.05762C10.5654 5.24447 10.4948 5.40625 10.3535 5.54297L6.84668 9.04297C6.7054 9.17969 6.54818 9.24805 6.375 9.24805C6.19271 9.24805 6.04004 9.1888 5.91699 9.07031C5.7985 8.94727 5.73926 8.79688 5.73926 8.61914C5.73926 8.52799 5.75521 8.44368 5.78711 8.36621C5.82357 8.28418 5.87142 8.21354 5.93066 8.1543L6.92871 7.13574L9.05469 5.21484L9.2666 5.59082L7.3252 5.71387H1.09082C0.890299 5.71387 0.728516 5.65234 0.605469 5.5293C0.486979 5.40625 0.427734 5.24902 0.427734 5.05762C0.427734 4.86621 0.486979 4.70898 0.605469 4.58594C0.728516 4.46289 0.890299 4.40137 1.09082 4.40137H7.3252L9.2666 4.52441L9.05469 4.90723L6.92871 2.97949L5.93066 1.96094C5.87142 1.90169 5.82357 1.83333 5.78711 1.75586C5.75521 1.67383 5.73926 1.58724 5.73926 1.49609C5.73926 1.3138 5.7985 1.16341 5.91699 1.04492C6.04004 0.926432 6.19271 0.867188 6.375 0.867188C6.54818 0.867188 6.7054 0.935547 6.84668 1.07227L10.3535 4.57227C10.4948 4.70898 10.5654 4.87077 10.5654 5.05762Z"
              fill={moreIconColor}
            />
          </svg>
        </KYText>
      </motion.div>
    </section>
  )
}

export { KYHero }
