import "./KYTestimonials.css"

import { KYText } from "../../../../components/KYText/KYText"
import { KYRatingStars } from "../../../../components/KYRatingStars/KYRatingStars"
import { KYBGPattern } from "../../../../components/KYBGPattern/KYBGPattern"

import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { motion } from "framer-motion"

const KYTestimonials = () => {
  const swiper = useSwiper()

  const testimonials = [
    {
      name: "Tolga Başaran",
      occupation: "Avukat",
      rating: 5,
      comment:
        "Gerek yakın ilgileri gerekse de işlerine hakimiyeti vesilesiyle aldığım hizmetten gayet memnun kaldım, teşekkürlerimi sunuyorum.",
    },
    {
      name: "Sevgi Yıldırım",
      occupation: "Yatırım Danışmanı",
      rating: 5,
      comment:
        "Gayrimenkul sektöründeki derin bilgisi ve samimi yaklaşımıyla alışveriş sürecimizi kolaylaştıran Keya Real Estate ekibine teşekkürlerimi iletiyorum.",
    },
    {
      name: "Mehmet Kaya",
      occupation: "İç Mimar",
      rating: 5,
      comment:
        "Profesyonel hizmet anlayışı ve çözüm odaklı yaklaşımlarıyla memnuniyetimi sağlayan Keya Real Estate ekibine teşekkür ederim.",
    },
    {
      name: "Ahmet Şahin",
      occupation: "Yatırımcı",
      rating: 5,
      comment:
        "Yakın ilgi ve profesyonel destekleriyle Keya Real Estate'e teşekkürlerimi sunarım. Piyasa bilgisi ve deneyimleriyle bizi memnun ettiler.",
    },
    {
      name: "Zeynep Akgün",
      occupation: "Yatırımcı",
      rating: 5,
      comment:
        "Keya Real Estate ekibinin hızlı ve etkili çözümleriyle işbirliği yapmaktan dolayı memnuniyetimi belirtmek isterim. Teşekkürler!",
    },
    {
      name: "Can Demir",
      occupation: "Yatırımcı",
      rating: 5,
      comment:
        "Keya Real Estate'in müşteri odaklı hizmet anlayışıyla karşılaşmaktan çok memnunum. Teşekkür ederim.",
    },
    {
      name: "Selin Aksoy",
      occupation: "Gayrimenkul Danışmanı",
      rating: 5,
      comment:
        "Keya Real Estate'in uzmanlığı ve özverili çalışmalarıyla piyasa koşullarında bana destek oldukları için teşekkür ederim.",
    },
  ]

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
        <div
          className="ky-testimonials-prev"
          onClick={() => swiper?.slidePrev()}
        ></div>
        <div
          className="ky-testimonials-next"
          onClick={() => swiper?.slideNext()}
        ></div>

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
          navigation={{
            prevEl: ".ky-testimonials-prev",
            nextEl: ".ky-testimonials-next",
          }}
          pagination={{ clickable: true }}
          loop
        >
          {testimonials.map((testimonial, i) => (
            <SwiperSlide key={i}>
              <div className="ky-testimonial-slide">
                <div className="ky-testimonial-top">
                  <div className="ky-testimonial-title">
                    <div className="ky-testimonial-name">
                      {testimonial.name}
                    </div>
                    <div className="ky-testimonial-desc">
                      {testimonial.occupation}
                    </div>
                  </div>
                  <KYRatingStars rating={testimonial.rating} />
                </div>

                <div className="ky-testimonial-comment">
                  {testimonial.comment}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <KYBGPattern type={8} />
    </section>
  )
}

export { KYTestimonials }
