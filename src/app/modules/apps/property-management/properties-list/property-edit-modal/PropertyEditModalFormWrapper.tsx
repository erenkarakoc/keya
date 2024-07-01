import { useQuery } from "react-query"
import { PropertyEditModalForm } from "./PropertyEditModalForm"
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers"
import { useListView } from "../../_core/ListViewProvider"
import { getPropertyById } from "../../_core/_requests"
import { APIProvider } from "@vis.gl/react-google-maps"

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
    return (
      <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}>
        <PropertyEditModalForm
          isPropertyLoading={isLoading}
          property={property}
        />
      </APIProvider>
    )
  }

  return null
}

export { PropertyEditModalFormWrapper }
