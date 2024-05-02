import "./Theme.css"
import { KYText } from "./components/KYText/KYText"

const Theme = () => {
  return (
    <>
      <KYText variant="heading">
        Hayalindeki <span className="ky-text-highlight">mülkü bulmak</span> hiç
        bu kadar kolay olmamıştı!
      </KYText>
    </>
  )
}

export { Theme }
