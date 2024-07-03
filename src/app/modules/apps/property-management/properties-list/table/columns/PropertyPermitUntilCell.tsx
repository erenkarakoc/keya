import { FC } from "react"
import { timestampToTurkishDate } from "../../../../../../../_metronic/helpers/kyHelpers"

type Props = {
  date?: string
}

const PropertyPermitUntilCell: FC<Props> = ({ date }) => {
  return date === "limitless" ? (
    <div className="badge badge-light fw-bolder">Süresiz</div>
  ) : (
    <div className="badge badge-light fw-bolder">
      {date && timestampToTurkishDate(date)}
    </div>
  )
}

export { PropertyPermitUntilCell }
