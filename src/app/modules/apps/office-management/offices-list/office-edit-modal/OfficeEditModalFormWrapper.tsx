import { useQuery } from "react-query"
import { OfficeEditModalForm } from "./OfficeEditModalForm"
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers"
import { useListView } from "../../_core/ListViewProvider"
import { getOfficeById } from "../../_core/_requests"

const OfficeEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: office,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-office-${itemIdForUpdate}`,
    () => {
      return getOfficeById(itemIdForUpdate as string)
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

  if (!isLoading && !error && office) {
    return <OfficeEditModalForm isOfficeLoading={isLoading} office={office} />
  }

  return null
}

export { OfficeEditModalFormWrapper }
