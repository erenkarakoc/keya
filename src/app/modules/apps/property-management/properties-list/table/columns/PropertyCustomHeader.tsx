import clsx from "clsx"
import { FC, PropsWithChildren, useMemo } from "react"
import { HeaderProps } from "react-table"
import { initialQueryState } from "../../../../../../../_metronic/helpers"
import { useQueryRequest } from "../../../_core/QueryRequestProvider"
import { Property } from "../../../_core/_models"

type Props = {
  className?: string
  title?: string
  tableProps: PropsWithChildren<HeaderProps<Property>>
}
const PropertyCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  const id = tableProps.column.id
  const { state, updateState } = useQueryRequest()

  const isSelectedForSorting = useMemo(() => {
    return state.sort && state.sort === id
  }, [state, id])
  const order: "asc" | "desc" | undefined = useMemo(() => state.order, [state])

  const sortColumn = () => {
    // avoid sorting for these columns
    if (id != "price" && id != "active") {
      return
    }

    if (!isSelectedForSorting) {
      // enable sort asc
      console.log(id)
      updateState({ sort: id, order: "asc", ...initialQueryState })
      return
    }

    if (isSelectedForSorting && order !== undefined) {
      if (order === "asc") {
        // enable sort desc
        updateState({ sort: id, order: "desc", ...initialQueryState })
        return
      }

      // disable sort
      updateState({ sort: undefined, order: undefined, ...initialQueryState })
    }
  }

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={clsx(
        className,
        isSelectedForSorting && order !== undefined && `table-sort-${order}`
      )}
      onClick={sortColumn}
      style={{
        cursor: id === "price" || id === "active" ? "pointer" : "default",
      }}
    >
      {title}
    </th>
  )
}

export { PropertyCustomHeader }
