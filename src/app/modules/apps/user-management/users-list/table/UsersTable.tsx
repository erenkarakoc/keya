import { useMemo, useState, useEffect } from "react"
import { useTable, ColumnInstance, Row } from "react-table"
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn"
import { CustomRow } from "./columns/CustomRow"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { usersColumns } from "./columns/_columns"
import { User } from "../core/_models"
import { UsersListLoading } from "../components/loading/UsersListLoading"
import { UsersListPagination } from "../components/pagination/UsersListPagination"
import { KTCardBody } from "../../../../../../_metronic/helpers"

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getFirestore()
        const usersCollection = collection(db, "users")
        const usersSnapshot = await getDocs(usersCollection)
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          uid: doc.data().uid,
          email: doc.data().email,
          emailVerified: doc.data().emailVerified,
          first_name: doc.data().first_name,
          last_name: doc.data().last_name,
          photoURL: doc.data().photoURL,
          phoneNumber: doc.data().phoneNumber,
          role: doc.data().role,
          permissions: doc.data().permissions,
          emailSettings: doc.data().emailSettings,
          address: doc.data().address,
          createdAt: doc.data().createdAt,
          lastLoginAt: doc.data().lastLoginAt,
        }))
        setUsers(usersData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const columns = useMemo(() => usersColumns, [])
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable({
      columns,
      data: users,
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
      <UsersListPagination />
      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { UsersTable }
