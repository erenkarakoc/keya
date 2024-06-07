import { FC, PropsWithChildren } from "react"
import { HeaderProps } from "react-table"
import { useListView } from "../../../_core/ListViewProvider"
import { Office } from "../../../_core/_models"

type Props = {
  tableProps: PropsWithChildren<HeaderProps<Office>>
}

const OfficeSelectionHeader: FC<Props> = ({ tableProps }) => {
  const { isAllSelected, onSelectAll } = useListView()
  return (
    <th {...tableProps.column.getHeaderProps()} className="w-10px pe-2">
      <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
        <input
          className="form-check-input"
          type="checkbox"
          data-kt-check={isAllSelected}
          data-kt-check-target="#kt_table_offices .form-check-input"
          checked={isAllSelected}
          onChange={onSelectAll}
        />
      </div>
    </th>
  )
}

export { OfficeSelectionHeader }
