import { useQuery } from "react-query"
import { OfficeEditModalForm } from "./OfficeEditModalForm"
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers"
import { useListView } from "../core/ListViewProvider"
import { getUserById } from "../core/_requests"

const OfficeEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getUserById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  if (!isLoading && !error && user) {
    return <OfficeEditModalForm isUserLoading={isLoading} user={user} />
  }

  return null
}

export { OfficeEditModalFormWrapper }
