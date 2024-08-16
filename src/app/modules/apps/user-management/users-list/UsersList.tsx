import { ListViewProvider, useListView } from "./../_core/ListViewProvider"
import { UsersListHeader } from "./components/header/UsersListHeader"
import { UsersTable } from "./table/UsersTable"
import { UserEditModal } from "./user-edit-modal/UserEditModal"
import { KTCard } from "../../../../../_metronic/helpers"

const UsersList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const UsersListWrapper = () => (
  <ListViewProvider>
    <UsersList />
  </ListViewProvider>
)

export { UsersListWrapper }
