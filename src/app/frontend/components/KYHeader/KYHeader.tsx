import "./KYHeader.css"

import { Link } from "react-router-dom"

import { KYNav } from "../KYNav/KYNav"
import { KYNavItem } from "../KYNavItem/KYNavItem"
import { KYButton } from "../KYButton/KYButton"

const KYHeader = () => {
  return (
    <header className="ky-header">
      <div className="ky-header-wrapper">
        <Link to="/">
          <svg
            width="95"
            height="25"
            viewBox="0 0 85 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_281_460)">
              <path
                d="M4.27014 11.0564C4.3839 11.7099 4.47057 12.3634 4.47057 12.9312V19.6967H0.101807V0.0858154H4.47057V5.62999C4.47057 6.39868 4.41369 7.19415 4.27014 7.96015H5.96564L10.9953 0.0858154H15.7378L10.6215 7.90391C10.2179 8.61367 9.7602 9.03953 9.1833 9.46806V9.58055C9.7575 9.97695 10.4482 10.66 10.8517 11.3162L16.0845 19.7021H11.1984L5.96564 11.0617H4.27014V11.0564Z"
                fill="white"
              />
              <path
                d="M37.0696 19.4984C34.3665 19.7823 30.9457 19.7823 27.8716 19.7823C25.2281 19.7823 23.5299 18.2476 23.5029 15.8317V3.95056C23.5326 1.53469 25.2281 0 27.8716 0C30.9484 0 34.3692 0 37.0696 0.283905L36.8691 3.49524H29.2529C28.305 3.49524 27.9014 3.9211 27.9014 4.94423V7.92791H35.8074V11.0535H27.9014V14.8354C27.9014 15.888 28.305 16.3138 29.2529 16.3138H36.8691L37.0696 19.4984Z"
                fill="white"
              />
              <path
                d="M54.9186 19.6994H50.5201V13.2178L43.9683 0.0858154H48.5375L51.8445 7.27718C52.1885 8.04586 52.3916 8.95382 52.592 9.74929H52.8791C53.0525 8.95382 53.2827 8.04318 53.5969 7.27718L56.9039 0.0858154H61.4162L54.9186 13.2178V19.6994Z"
                fill="white"
              />
              <path
                d="M74.869 14.4792L72.2607 22H77.3987L74.869 14.4792Z"
                fill="#EA0029"
              />
              <path
                d="M78.4335 1.22143C78.2602 0.511666 77.6562 0.0831299 76.9113 0.0831299H72.7728C72.0551 0.0831299 71.4213 0.508987 71.2479 1.22143L65.5276 19.6966H70.0129L73.393 7.30664L73.4553 7.30128L74.0404 5.20146C74.1839 4.60418 74.3275 3.95067 74.471 3.3534H75.2456C75.3323 3.95067 75.5057 4.60418 75.6492 5.20146L76.9384 9.84303L78.2602 14.5515H78.2656L79.7038 19.6966H84.1592L78.4389 1.22143H78.4335Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_281_460">
                <rect width="85" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Link>

        <KYNav>
          <KYNavItem to="/" text="Ana Sayfa" />
          <KYNavItem to="/franchise" text="Franchise" />
          <KYNavItem to="/ilanlar" text="İlanlarımız" />
          <KYNavItem to="/ofislerimiz" text="Ofislerimiz" />
          <KYNavItem to="/danismanlarimiz" text="Danışmanlarımız" />
          {/* <KYNavItem to="/kariyer" text="Kariyer" /> */}
          <KYButton secondary to="/sat-kirala" text="Sat & Kirala" />
        </KYNav>
      </div>
    </header>
  )
}

export { KYHeader }
