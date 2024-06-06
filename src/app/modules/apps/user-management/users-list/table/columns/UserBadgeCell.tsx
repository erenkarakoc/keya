import { FC, useState, useEffect } from "react"
import { getUserRoleText } from "../../../../../../../_metronic/helpers/kyHelpers"
import { getOfficeNameById } from "../../../../office-management/offices-list/core/_requests"

type Props = {
  text?: string
  type?: "role" | "officeId"
}

const UserBadgeCell: FC<Props> = ({ text, type }) => {
  const [badgeText, setBadgeText] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchData = async () => {
      if (text && type === "officeId") {
        try {
          const officeName = await getOfficeNameById(text)
          setBadgeText(officeName ? "Keya " + officeName : "")
        } catch (error) {
          console.error("Error fetching office name:", error)
          setBadgeText("")
        }
      } else if (type === "role") {
        setBadgeText(getUserRoleText(text || ""))
      } else {
        setBadgeText("")
      }
    }

    fetchData()
  }, [text, type])

  return <div className="badge badge-light fw-bolder">{badgeText}</div>
}

export { UserBadgeCell }
