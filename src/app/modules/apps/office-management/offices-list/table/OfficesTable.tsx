import { useMemo } from "react"
import { useTable, ColumnInstance, Row } from "react-table"
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn"
import { CustomRow } from "./columns/CustomRow"
import { officesColumns } from "./columns/_columns"
import { User } from "../core/_models"
import { OfficesListLoading } from "../components/loading/OfficesListLoading"
import { OfficesListPagination } from "../components/pagination/OfficesListPagination"
import { KTCardBody } from "../../../../../../_metronic/helpers"
import {
  useQueryResponseData,
  useQueryResponseLoading,
} from "../core/QueryResponseProvider"

const OfficesTable = () => {
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => users, [users])
  const columns = useMemo(() => officesColumns, [])
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable({
      columns,
      data,
    })

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_users"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              {headers.map((column: ColumnInstance<User>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<User>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className="d-flex text-center w-100 align-content-center justify-content-center">
                    Bu filtrelere uygun kullanıcı bulunamadı.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <OfficesListPagination />
      {isLoading && <OfficesListLoading />}
    </KTCardBody>
  )
}

export { OfficesTable }
