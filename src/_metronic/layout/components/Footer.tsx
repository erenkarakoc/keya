import { FC } from "react"
import { useLayout } from "../core"

const Footer: FC = () => {
  const { classes } = useLayout()
  return (
    <div className="footer py-4 d-flex flex-lg-column" id="kt_footer">
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row flex-stack`}
      >
        {/* begin::Copyright */}
        <div className="text-gray-900 order-2 order-md-1">
          <span className="text-gray-500 fw-bold me-1">2024 ©</span>{" "}
          <a
            href="/"
            target="_blank"
            className="text-muted text-hover-primary fw-bold me-2 fs-6"
          >
            Keya Real Estate
          </a>
        </div>
        {/* end::Copyright */}

        {/* begin::Menu */}
        <ul className="menu menu-gray-600 menu-hover-primary fw-bold order-1">
          <li className="menu-item">
            <a href="/hakkimizda" className="menu-link px-2" target="_blank">
              Hakkımızda
            </a>
          </li>
          <li className="menu-item">
            <a href="/egitimlerimiz" className="menu-link px-2" target="_blank">
              Eğitimlerimiz
            </a>
          </li>
          <li className="menu-item">
            <a href="iletisim" className="menu-link px-2" target="_blank">
              İletişim
            </a>
          </li>
        </ul>
        {/* end::Menu */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export { Footer }
