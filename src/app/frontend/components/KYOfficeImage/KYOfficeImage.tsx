import { useRef, useEffect, useState } from "react"
import "./KYOfficeImage.css"

interface KYOfficeImageProps {
  height?: number
  width?: number
  officeName: string
}

const KYOfficeImage: React.FC<KYOfficeImageProps> = ({
  height,
  width,
  officeName,
}) => {
  const kyOfficeImageRef = useRef<HTMLDivElement>(null)
  const kyOfficeImageSpanRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState<number>(16)

  useEffect(() => {
    const updateFontSize = () => {
      if (kyOfficeImageRef.current && kyOfficeImageSpanRef.current) {
        const parentWidth = kyOfficeImageRef.current.offsetWidth
        const textLength = officeName.length
        const calculatedFontSize = Math.min(parentWidth / textLength) + 1.5
        setFontSize(calculatedFontSize)
      }
    }

    updateFontSize()
    window.addEventListener("resize", updateFontSize)

    return () => window.removeEventListener("resize", updateFontSize)
  }, [officeName])

  return (
    <div
      ref={kyOfficeImageRef}
      className="ky-office-image"
      style={{ height, width }}
    >
      <span style={{ fontSize: `${height ? height / 5 : 12}px` }}>
        {import.meta.env.VITE_APP_NAME}{" "}
      </span>
      <span ref={kyOfficeImageSpanRef} style={{ fontSize: `${fontSize}px` }}>
        {officeName}
      </span>
    </div>
  )
}

export { KYOfficeImage }
