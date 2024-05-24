import "./KYTestimonials.css"

import { KYText } from "../../../../components/KYText/KYText"
import { KYRatingStars } from "../../../../components/KYRatingStars/KYRatingStars"
import { KYBGPattern } from "../../../../components/KYBGPattern/KYBGPattern"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { motion } from "framer-motion"

const KYTestimonials = () => {
  return (
    <section className="ky-testimonials-section">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <KYText className="ky-section-title-center" variant="title">
          <span className="ky-text-highlight">Müşterilerimiz</span> bizden gayet
          memnun!
        </KYText>
      </motion.div>

      <div className="ky-testimonials-wrapper">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={2}
          autoplay={{
            delay: 2000,
            stopOnLastSlide: false,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop
        >
          <SwiperSlide>
            <div className="ky-testimonial-slide">
              <div className="ky-testimonial-top">
                <div className="ky-testimonial-title">
                  <div className="ky-testimonial-name">Tolga Başaran</div>
                  <div className="ky-testimonial-desc">Avukat</div>
                </div>
                <KYRatingStars rating={4} />
              </div>

              <div className="ky-testimonial-comment">
                Gerek yakın ilgileri gerekse de işlerine hakimiyeti vesilesiyle
                aldığım hizmetten gayet memnun kaldım. Piyasa koşullarına göre
                müşteri memnuniyeti sağlayan Keya Real Estate'e teşekkürlerimi
                sunuyorum.
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="ky-testimonial-slide">
              <div className="ky-testimonial-top">
                <div className="ky-testimonial-title">
                  <div className="ky-testimonial-name">Tolga Başaran</div>
                  <div className="ky-testimonial-desc">Avukat</div>
                </div>
                <KYRatingStars rating={2} />
              </div>
              <div className="ky-testimonial-comment">
                Gerek yakın ilgileri gerekse de işlerine hakimiyeti vesilesiyle
                aldığım hizmetten gayet memnun kaldım. Piyasa koşullarına göre
                müşteri memnuniyeti sağlayan Keya Real Estate'e teşekkürlerimi
                sunuyorum.
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="ky-testimonial-slide">
              <div className="ky-testimonial-top">
                <div className="ky-testimonial-title">
                  <div className="ky-testimonial-name">Tolga Başaran</div>
                  <div className="ky-testimonial-desc">Avukat</div>
                </div>
                <KYRatingStars rating={3} />
              </div>
              <div className="ky-testimonial-comment">
                Gerek yakın ilgileri gerekse de işlerine hakimiyeti vesilesiyle
                aldığım hizmetten gayet memnun kaldım. Piyasa koşullarına göre
                müşteri memnuniyeti sağlayan Keya Real Estate'e teşekkürlerimi
                sunuyorum.
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="ky-testimonial-slide">
              <div className="ky-testimonial-top">
                <div className="ky-testimonial-title">
                  <div className="ky-testimonial-name">Tolga Başaran</div>
                  <div className="ky-testimonial-desc">Avukat</div>
                </div>
                <KYRatingStars rating={5} />
              </div>
              <div className="ky-testimonial-comment">
                Gerek yakın ilgileri gerekse de işlerine hakimiyeti vesilesiyle
                aldığım hizmetten gayet memnun kaldım. Piyasa koşullarına göre
                müşteri memnuniyeti sağlayan Keya Real Estate'e teşekkürlerimi
                sunuyorum.
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <KYBGPattern type={8} />
    </section>
  )
}

export { KYTestimonials }
