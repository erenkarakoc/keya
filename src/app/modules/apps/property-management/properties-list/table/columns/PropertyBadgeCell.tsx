import { FC, useEffect, useState } from "react"
import { formatPrice } from "../../../../../../../_metronic/helpers/kyHelpers"

type Props = {
  text?: string
}

const PropertyBadgeCell: FC<Props> = ({ text }) => {
  const [price, setPrice] = useState("")

  useEffect(() => {
    if (text) {
      setPrice(formatPrice(text?.toString()))
    }
  }, [text])

  return <div className="badge badge-light fw-bolder">{price}</div>
}

export { PropertyBadgeCell }
