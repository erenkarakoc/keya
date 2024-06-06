import { FC } from "react"

type Props = {
  two_steps?: boolean
}

const OfficeTwoStepsCell: FC<Props> = ({ two_steps }) => (
  <>
    {" "}
    {two_steps && (
      <div className="badge badge-light-success fw-bolder">Aktif</div>
    )}
  </>
)

export { OfficeTwoStepsCell }
