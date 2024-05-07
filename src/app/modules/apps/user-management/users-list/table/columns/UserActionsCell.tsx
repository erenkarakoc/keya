import { FC, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../core/ListViewProvider"
import { useQueryResponse } from "../../core/QueryResponseProvider"
import { deleteUser, getUsersById } from "../../core/_requests"
import { UserDeleteModal } from "../../user-delete-modal/UserDeleteModal"
import { UserModel } from "../../../../../auth"

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate, itemIdForDelete, setItemIdForDelete } =
    useListView()
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()

  const [selectedUserForDelete, setSelectedUserForDelete] = useState<
    UserModel[]
  >([])

  const openEditModal = () => setItemIdForUpdate(id)
  const openDeleteModal = async () => {
    setItemIdForDelete(id)
    setSelectedUserForDelete(await getUsersById([itemIdForDelete as string]))
  }
  const handleOnDecline = () => setSelectedUserForDelete([])
  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  return (
    <>
      <UserDeleteModal
        id="kt_modal_delete_confirmation_single"
        title="Emin misiniz?"
        description="Devam etmeniz halinde aşağıdaki kullanıcı kalıcı olarak silinecektir:"
        onApproval={async () => await deleteItem.mutateAsync()}
        onDecline={handleOnDecline}
        selectedUsersForDelete={selectedUserForDelete}
      />

      <button
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon iconName="gear" iconType="solid" className="fs-5 m-0 p-0" />
      </button>

      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        <div className="menu-item px-3">
          <a className="menu-link px-3" onClick={openEditModal}>
            Düzenle
          </a>
        </div>

        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_delete_confirmation_single"
            onClick={openDeleteModal}
          >
            Sil
          </a>
        </div>
      </div>
    </>
  )
}

export { UserActionsCell }
