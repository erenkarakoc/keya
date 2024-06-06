import { FC } from "react"

type Props = {
  text?: string
}

const OfficeBadgeCell: FC<Props> = ({ text }) => {
  return <div className="badge badge-light fw-bolder">{text}</div>
}

export { OfficeBadgeCell }
