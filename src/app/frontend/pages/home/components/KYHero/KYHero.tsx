import "./KYHero.css"

import { Link } from "react-router-dom"

import { KYText } from "../../../../components/KYText/KYText"
import { KYHeroSearchInput } from "../KYHeroSearchInput/KYHeroSearchInput"
import { KYServices } from "../KYServices/KYServices"

import { motion } from "framer-motion"
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

const KYHero = () => {
  const bgUrls = [
    toAbsoluteUrl("media/hero/hero-bg-1.jpg"),
    toAbsoluteUrl("media/hero/hero-bg-2.jpg"),
    toAbsoluteUrl("media/hero/hero-bg-3.jpg"),
    toAbsoluteUrl("media/hero/hero-bg-4.jpg"),
  ]

  return (
    <div className="ky-hero-section-wrapper">
      <Swiper
        className="hero-bg-swiper"
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        {bgUrls.map((url) => (
          <SwiperSlide>
            <img className="ky-hero-section-bg" src={url} draggable="false" />
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="ky-hero-section">
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

        <KYServices />
      </section>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        id="hero-mouse-icon-wrapper"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 30 70"
        >
          <defs>
            <clipPath
              id="innerMouse"
              clipPathUnits="userSpaceOnUse"
              transform="translate(0,20)"
            >
              <path d="M -5,-5 H 35 V 55 H -5 Z M 15,2 C 7.798,2 2,7.7363825 2,14.861844 V 35.138156 C 2,42.263618 7.798,48 15,48 22.202,48 28,42.263618 28,35.138156 V 14.861844 C 28,7.7363825 22.202,2 15,2 Z m 0,12.591668 c -1.108,0 -2,0.892 -2,2 v 3 c 0,1.108 0.892,2 2,2 v 0 c 1.108,0 2,-0.892 2,-2 v -3 c 0,-1.108 -0.892,-2 -2,-2 z" />
            </clipPath>
          </defs>
          <rect
            type="rect"
            clipPath="url(#innerMouse)"
            rx="15"
            x="0"
            y="20"
            height="50"
            width="30"
            id="rect21"
            fill="white"
          />
          <g transform="translate(0,10)">
            <path
              id="arrowUp"
              d="M 15,4.3825497 9.8039349,7.382367 10.803874,9.114561 15,6.6919697 19.196127,9.114561 20.196065,7.382367 Z"
              fill="red"
            />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              from="0 8"
              to="0 -2"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              id="op1"
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.5s"
              begin="0s;op2.end"
            />
            <animate
              id="op2"
              attributeName="opacity"
              from="1"
              to="0"
              dur="0.5s"
              begin="op1.end"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  )
}

export { KYHero }
