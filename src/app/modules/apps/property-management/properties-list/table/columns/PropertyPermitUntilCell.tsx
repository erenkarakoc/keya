import { FC } from "react"
import { convertToTurkishDate } from "../../../../../../../_metronic/helpers/kyHelpers"

type Props = {
  date?: string
}

const PropertyPermitUntilCell: FC<Props> = ({ date }) => {
  return (
    date && (
      <div className="badge badge-light fw-bolder">
        {convertToTurkishDate(date)}
      </div>
    )
  )
}

export { PropertyPermitUntilCell }
