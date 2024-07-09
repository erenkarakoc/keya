import { FC, useEffect, useState } from "react"
import { getStateById } from "../../../../../../../_metronic/helpers/kyHelpers"

type Props = {
  stateId?: string
}

const OfficeBadgeCell: FC<Props> = ({ stateId }) => {
  const [stateName, setStateName] = useState("")

  useEffect(() => {
    const fetchState = async () => {
      if (stateId) {
        const state = await getStateById(stateId)
        if (state) {
          setStateName(state.name ?? "")
        }
      }
    }

    fetchState()
  }, [stateId])

  return <div className="badge badge-light fw-bolder">{stateName ?? ""}</div>
}

export { OfficeBadgeCell }
