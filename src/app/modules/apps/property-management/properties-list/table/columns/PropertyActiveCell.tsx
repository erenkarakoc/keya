import { FC } from "react"

type Props = {
  isActive?: string
}

const PropertyActiveCell: FC<Props> = ({ isActive }) => {
  return (
    <>
      {isActive === "true" ? (
        <div className="badge badge-success fw-bolder">Evet</div>
      ) : (
        <div className="badge badge-danger fw-bolder">Hayır</div>
      )}
    </>
  )
}

export { PropertyActiveCell }
