import {FC} from 'react'

type Props = {
  text?: string
}

const UserBadgeCell: FC<Props> = ({text}) => (
  <div className='badge badge-light fw-bolder'>{text}</div>
)

export {UserBadgeCell}
