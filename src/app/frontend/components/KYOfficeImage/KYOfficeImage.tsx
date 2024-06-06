import { useRef, useEffect, useState } from "react"
import "./KYOfficeImage.css"

interface KYOfficeImageProps {
  height?: number
  width?: number
  officeId?: string
  officeName?: string
}

const KYOfficeImage: React.FC<KYOfficeImageProps> = ({
  height,
  width,
  officeId,
  officeName,
}) => {
  const kyOfficeImageRef = useRef<HTMLDivElement>(null)
  const kyOfficeImageSpanRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState<number>(16)

  useEffect(() => {
    const updateFontSize = () => {
      if (kyOfficeImageRef.current && kyOfficeImageSpanRef.current) {
        const parentWidth = kyOfficeImageRef.current.offsetWidth
        const textLength = officeName
          ? officeName.length
          : officeId?.length || 0
        const calculatedFontSize = Math.min(parentWidth / textLength) + 1.5
        setFontSize(calculatedFontSize)
      }
    }

    updateFontSize()
    window.addEventListener("resize", updateFontSize)

    return () => window.removeEventListener("resize", updateFontSize)
  }, [officeName, officeId])

  return (
    <div
      ref={kyOfficeImageRef}
      className="ky-office-image"
      style={{ height, width }}
    >
      KEYA{" "}
      <span ref={kyOfficeImageSpanRef} style={{ fontSize: `${fontSize}px` }}>
        {officeName ? officeName : officeId}
      </span>
    </div>
  )
}

export { KYOfficeImage }
