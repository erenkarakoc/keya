/* eslint-disable react-refresh/only-export-components */
import { FC, useState, createContext, useContext, useMemo } from "react"
import {
  ID,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  initialListView,
  ListViewContextProps,
  groupingOnSelectAll,
  WithChildren,
} from "../../../../../_metronic/helpers"
import { useQueryResponse, useQueryResponseData } from "./QueryResponseProvider"

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(
    initialListView.itemIdForUpdate
  )
  const [itemIdForDelete, setItemIdForDelete] = useState<ID>(
    initialListView.itemIdForDelete
  )
  const { isLoading } = useQueryResponse()
  const data = useQueryResponseData()
  const disabled = useMemo(
    () => calculatedGroupingIsDisabled(isLoading, data),
    [isLoading, data]
  )
  const isAllSelected = useMemo(
    () => calculateIsAllDataSelected(data, selected),
    [data, selected]
  )
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForDelete,
        setItemIdForDelete,
        itemIdForUpdate,
        setItemIdForUpdate,
        disabled,
        isAllSelected,
        onSelect: (id: ID) => {
          groupingOnSelect(id, selected, setSelected)
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, data)
        },
        clearSelected: () => {
          setSelected([])
        },
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export { ListViewProvider, useListView }
