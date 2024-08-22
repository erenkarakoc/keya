import { useEffect, useState } from "react"
import { User } from "../../_core/_models"
import { UsersListLoading } from "../components/loading/UsersListLoading"
import { KTCardBody } from "../../../../../../_metronic/helpers"
import { MenuComponent } from "../../../../../../_metronic/assets/ts/components"
import { UserActionsCell } from "./columns/UserActionsCell"
import { UserInfoCell } from "./columns/UserInfoCell"
import { getAllUsers, getUsersByOfficeId } from "../../_core/_requests"
import { UserSelectionCell } from "./columns/UserSelectionCell"
import { UserBadgeCell } from "./columns/UserBadgeCell"
import { UsersListPagination } from "../components/pagination/UsersListPagination"
import { useAuth } from "../../../../auth"
import { useListView } from "../../_core/ListViewProvider"
import { slugify } from "../../../../../../_metronic/helpers/kyHelpers"

const UsersTable = () => {
  const { currentUser } = useAuth()
  const { searchTerm } = useListView()

  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser?.role === "admin") {
        const allUsers = await getAllUsers()
        setUsers(allUsers ?? [])
      } else if (currentUser?.officeId) {
        const officeUsers = await getUsersByOfficeId(currentUser.officeId)
        setUsers(officeUsers ?? [])
      }
    }

    if (currentUser) {
      fetchUsers()
    }
  }, [currentUser])

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(
        users.filter((user) =>
          slugify(user.email).includes(slugify(searchTerm.toLowerCase()))
        )
      )
    } else {
      setFilteredUsers(users)
    }
    setCurrentPage(1)
  }, [searchTerm, users])

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [searchTerm, currentPage, filteredUsers])

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_users"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <th colSpan={1} role="columnheader" className="w-10px pe-2"></th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Kullanıcı
              </th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Ünvan
              </th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Ofis
              </th>
              <th
                colSpan={1}
                role="columnheader"
                className="text-end min-w-100px"
              ></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold">
            {users.length ? (
              paginatedUsers.length ? (
                paginatedUsers.map((user) => (
                  <tr role="row" key={user.id}>
                    <td role="cell">
                      <UserSelectionCell id={user.id} />
                    </td>
                    <td role="cell">
                      <UserInfoCell user={user} />
                    </td>
                    <td role="cell">
                      <UserBadgeCell text={user.role} type="role" />
                    </td>
                    <td role="cell">
                      <UserBadgeCell text={user.officeId} type="officeId" />
                    </td>
                    <td className="text-end min-w-100px actions" role="cell">
                      <UserActionsCell id={user.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="d-flex text-center w-100 align-content-center justify-content-center">
                      Bu filtrelere uygun kullanıcı bulunamadı.
                    </div>
                  </td>
                </tr>
              )
            ) : (
              <UsersListLoading />
            )}
          </tbody>
        </table>
      </div>

      <UsersListPagination
        usersLength={filteredUsers.length}
        paginatedUsersLength={paginatedUsers.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </KTCardBody>
  )
}

export { UsersTable }
