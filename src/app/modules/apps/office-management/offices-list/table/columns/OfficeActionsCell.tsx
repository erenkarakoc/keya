import { FC } from "react"
import { useMutation, useQueryClient } from "react-query"
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../core/ListViewProvider"
import { useQueryResponse } from "../../core/QueryResponseProvider"
import { deleteUser } from "../../core/_requests"
import { OfficeDeleteModal } from "../../office-delete-modal/OfficeDeleteModal"

type Props = {
  id: ID
}

const OfficeActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate } = useListView()

  const { query } = useQueryResponse()
  const queryClient = useQueryClient()

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  const openEditModal = () => setItemIdForUpdate(id)

  return (
    <>
      <OfficeDeleteModal
        id="kt_modal_delete_confirmation_single"
        title="Emin misiniz?"
        description="Devam etmeniz halinde bu kullanıcı kalıcı olarak silinecektir."
        onApproval={async () => await deleteItem.mutateAsync()}
      />

      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon iconName="gear" iconType="solid" className="fs-5 m-0 p-0" />
      </a>

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
          >
            Sil
          </a>
        </div>
      </div>
    </>
  )
}

export { OfficeActionsCell }
