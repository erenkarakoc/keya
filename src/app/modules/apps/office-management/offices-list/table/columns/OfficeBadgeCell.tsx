import { FC } from "react"
import { getUserRoleText } from "../../../../../../../_metronic/helpers/kyHelpers"

type Props = {
  text?: string
}

const OfficeBadgeCell: FC<Props> = ({ text }) => {
  return (
    <div className="badge badge-light fw-bolder">
      {getUserRoleText(text as string)}
    </div>
  )
}

export { OfficeBadgeCell }
