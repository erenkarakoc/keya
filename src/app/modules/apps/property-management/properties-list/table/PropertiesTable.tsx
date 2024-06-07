import { useMemo, useEffect } from "react"
import { useTable, ColumnInstance, Row } from "react-table"
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn"
import { CustomRow } from "./columns/CustomRow"
import { propertiesColumns } from "./columns/_columns"
import { Property } from "../../_core/_models"
import { PropertiesListLoading } from "../components/loading/PropertiesListLoading"
import { PropertiesListPagination } from "../components/pagination/PropertiesListPagination"
import { KTCardBody } from "../../../../../../_metronic/helpers"
import {
  useQueryResponseData,
  useQueryResponseLoading,
} from "../../_core/QueryResponseProvider"
import { MenuComponent } from "../../../../../../_metronic/assets/ts/components"

const PropertiesTable = () => {
  const properties = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => properties, [properties])
  const columns = useMemo(() => propertiesColumns, [])
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable({
      columns,
      data,
    })

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [data])

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_properties"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              {headers.map((column: ColumnInstance<Property>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Property>, i) => {
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
      <PropertiesListPagination />
      {isLoading && <PropertiesListLoading />}
    </KTCardBody>
  )
}

export { PropertiesTable }
