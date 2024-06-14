import { FC } from "react"

type Props = {
  isActive?: boolean
}

const PropertyActiveCell: FC<Props> = ({ isActive }) => {
  return (
    <>
      {isActive ? (
        <div className="badge badge-success fw-bolder">Evet</div>
      ) : (
        <div className="badge badge-danger fw-bolder">{isActive}Hayır</div>
      )}
    </>
  )
}

export { PropertyActiveCell }
