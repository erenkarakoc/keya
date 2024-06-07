import { useQuery } from "react-query"
import { PropertyEditModalForm } from "./PropertyEditModalForm"
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers"
import { useListView } from "../../_core/ListViewProvider"
import { getPropertyById } from "../../_core/_requests"

const PropertyEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: property,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-property-${itemIdForUpdate}`,
    () => {
      return getPropertyById(itemIdForUpdate as string)
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

  if (!isLoading && !error && property) {
    return <PropertyEditModalForm isPropertyLoading={isLoading} property={property} />
  }

  return null
}

export { PropertyEditModalFormWrapper }
