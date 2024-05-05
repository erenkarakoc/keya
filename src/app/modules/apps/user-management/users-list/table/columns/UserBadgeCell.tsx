import { FC } from "react"
import { getUserRoleText } from "../../../../../../../_metronic/helpers/kyHelpers"

type Props = {
  text?: string
}

const UserBadgeCell: FC<Props> = ({ text }) => {
  return (
    <div className="badge badge-light fw-bolder">{getUserRoleText(text)}</div>
  )
}

export { UserBadgeCell }
