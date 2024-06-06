import "./KYFooter.css"

import { Link } from "react-router-dom"
import { KYText } from "../KYText/KYText"
import { KYBGPattern } from "../KYBGPattern/KYBGPattern"
import { KYFooterTop } from "./components/KYFooterTop/KYFooterTop"

const KYFooter = () => {
  return (
    <>
      <KYFooterTop />

      <footer className="ky-footer">
        <KYBGPattern type={7} />

        <div className="ky-footer-wrapper">
          <div className="ky-footer-left">
            <Link to="/">
              <svg
                width="85"
                height="22"
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

            <KYText variant="paragraph" fontSize={16}>
              Uzun yıllardır gayrimenkul sektöründe etkin pazarlama ve
              danışmanlık hizmetleri vermekte olan Keya; giderek büyümekte olan
              hedefleri ile birlikte müşterilerine en iyi hizmeti vermek adına
              çalışmalarını sürdürmektedir.
            </KYText>
          </div>

          <nav className="ky-footer-right">
            <ul className="ky-footer-list">
              <li className="ky-footer-item">Genel Bilgiler</li>
              <li className="ky-footer-item">
                <Link to="/hakkimizda">Hakkımızda</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/sat-kirala">Sat & Kirala</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/egitimlerimiz">Eğitimlerimiz</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
            <ul className="ky-footer-list">
              <li className="ky-footer-item">Keya Ekibi</li>
              <li className="ky-footer-item">
                <Link to="/ofislerimiz">Ofislerimiz</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/danismanlarimiz">Danışmanlarımız</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/giris">Giriş Yap</Link>
              </li>
            </ul>
            <ul className="ky-footer-list">
              <li className="ky-footer-item">İlanlar</li>
              <li className="ky-footer-item">
                <Link to="/konut">Konut</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/proje">Proje</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/ticari">Ticari</Link>
              </li>
              <li className="ky-footer-item">
                <Link to="/arsa">Arsa</Link>
              </li>
            </ul>
            <ul className="ky-footer-list">
              <li className="ky-footer-item">İletişim</li>
              <li className="ky-footer-item">
                <a href="tel:903124394545">+90 (312) 439 45 45</a>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ky-external-link"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0.616438C0 0.275989 0.275989 0 0.616438 0H4.45205C4.7925 0 5.06849 0.275989 5.06849 0.616438C5.06849 0.956888 4.7925 1.23288 4.45205 1.23288H1.23288V8.28767C1.23288 8.41483 1.28339 8.53678 1.3733 8.62669C1.46322 8.71661 1.58517 8.76712 1.71233 8.76712H8.28767C8.41483 8.76712 8.53678 8.71661 8.62669 8.62669C8.71661 8.53678 8.76712 8.41483 8.76712 8.28767V5.54795C8.76712 5.2075 9.04311 4.93151 9.38356 4.93151C9.72401 4.93151 10 5.2075 10 5.54795V8.28767C10 8.74181 9.81959 9.17735 9.49847 9.49847C9.17735 9.81959 8.74181 10 8.28767 10H1.71233C1.25819 10 0.822653 9.81959 0.501529 9.49847C0.180406 9.17735 0 8.74181 0 8.28767V0.616438ZM6.64384 1.23288C6.30339 1.23288 6.0274 0.956888 6.0274 0.616438C6.0274 0.275989 6.30339 0 6.64384 0H9.38356C9.72401 0 10 0.275989 10 0.616438V3.35616C10 3.69661 9.72401 3.9726 9.38356 3.9726C9.04311 3.9726 8.76712 3.69661 8.76712 3.35616V2.10465L3.79205 7.07972C3.55132 7.32046 3.16101 7.32046 2.92028 7.07972C2.67954 6.83899 2.67954 6.44868 2.92028 6.20795L7.89535 1.23288H6.64384Z"
                    fill="currentColor"
                  />
                </svg>
              </li>
              <li className="ky-footer-item">
                <a href="tel:905326635392" target="_blank">
                  +90 (532) 663 53 92
                </a>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ky-external-link"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0.616438C0 0.275989 0.275989 0 0.616438 0H4.45205C4.7925 0 5.06849 0.275989 5.06849 0.616438C5.06849 0.956888 4.7925 1.23288 4.45205 1.23288H1.23288V8.28767C1.23288 8.41483 1.28339 8.53678 1.3733 8.62669C1.46322 8.71661 1.58517 8.76712 1.71233 8.76712H8.28767C8.41483 8.76712 8.53678 8.71661 8.62669 8.62669C8.71661 8.53678 8.76712 8.41483 8.76712 8.28767V5.54795C8.76712 5.2075 9.04311 4.93151 9.38356 4.93151C9.72401 4.93151 10 5.2075 10 5.54795V8.28767C10 8.74181 9.81959 9.17735 9.49847 9.49847C9.17735 9.81959 8.74181 10 8.28767 10H1.71233C1.25819 10 0.822653 9.81959 0.501529 9.49847C0.180406 9.17735 0 8.74181 0 8.28767V0.616438ZM6.64384 1.23288C6.30339 1.23288 6.0274 0.956888 6.0274 0.616438C6.0274 0.275989 6.30339 0 6.64384 0H9.38356C9.72401 0 10 0.275989 10 0.616438V3.35616C10 3.69661 9.72401 3.9726 9.38356 3.9726C9.04311 3.9726 8.76712 3.69661 8.76712 3.35616V2.10465L3.79205 7.07972C3.55132 7.32046 3.16101 7.32046 2.92028 7.07972C2.67954 6.83899 2.67954 6.44868 2.92028 6.20795L7.89535 1.23288H6.64384Z"
                    fill="currentColor"
                  />
                </svg>
              </li>
              <li className="ky-footer-item">
                <a href="mailto:info@keya.com.tr" target="_blank">
                  info@keya.com.tr
                </a>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ky-external-link"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0.616438C0 0.275989 0.275989 0 0.616438 0H4.45205C4.7925 0 5.06849 0.275989 5.06849 0.616438C5.06849 0.956888 4.7925 1.23288 4.45205 1.23288H1.23288V8.28767C1.23288 8.41483 1.28339 8.53678 1.3733 8.62669C1.46322 8.71661 1.58517 8.76712 1.71233 8.76712H8.28767C8.41483 8.76712 8.53678 8.71661 8.62669 8.62669C8.71661 8.53678 8.76712 8.41483 8.76712 8.28767V5.54795C8.76712 5.2075 9.04311 4.93151 9.38356 4.93151C9.72401 4.93151 10 5.2075 10 5.54795V8.28767C10 8.74181 9.81959 9.17735 9.49847 9.49847C9.17735 9.81959 8.74181 10 8.28767 10H1.71233C1.25819 10 0.822653 9.81959 0.501529 9.49847C0.180406 9.17735 0 8.74181 0 8.28767V0.616438ZM6.64384 1.23288C6.30339 1.23288 6.0274 0.956888 6.0274 0.616438C6.0274 0.275989 6.30339 0 6.64384 0H9.38356C9.72401 0 10 0.275989 10 0.616438V3.35616C10 3.69661 9.72401 3.9726 9.38356 3.9726C9.04311 3.9726 8.76712 3.69661 8.76712 3.35616V2.10465L3.79205 7.07972C3.55132 7.32046 3.16101 7.32046 2.92028 7.07972C2.67954 6.83899 2.67954 6.44868 2.92028 6.20795L7.89535 1.23288H6.64384Z"
                    fill="currentColor"
                  />
                </svg>
              </li>
            </ul>
          </nav>
        </div>

        <span className="ky-footer-copy">2024 &copy; Keya Real Estate</span>
      </footer>
    </>
  )
}

export { KYFooter }
