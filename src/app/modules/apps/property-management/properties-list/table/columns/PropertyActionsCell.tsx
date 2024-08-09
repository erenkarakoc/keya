import { FC } from "react"
import { useMutation, useQueryClient } from "react-query"
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../../_core/ListViewProvider"
import { useQueryResponse } from "../../../_core/QueryResponseProvider"
import { deleteProperty } from "../../../_core/_requests"
import { PropertyDeleteModal } from "../../property-delete-modal/PropertyDeleteModal"

import toast from "react-hot-toast"
import { useAuth } from "../../../../../auth"

type Props = {
  id: ID
  userIds: string[]
}

const PropertyActionsCell: FC<Props> = ({ id, userIds }) => {
  const { setItemIdForUpdate, setItemIdForDelete, itemIdForDelete } =
    useListView()

  const { query } = useQueryResponse()
  const queryClient = useQueryClient()

  const { currentUser } = useAuth()

  const deleteItem = useMutation(
    () => deleteProperty(itemIdForDelete as string),
    {
      onSuccess: () => {
        toast.success("İlan başarıyla silindi!")
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      },
      onError: (error) => {
        toast.error("İlan silinirken bir hata oluştu!")
        console.error(error)
      },
    }
  )

  const openEditModal = () => setItemIdForUpdate(id)

  return currentUser?.role === "admin" ||
    currentUser?.role === "broker" ||
    currentUser?.role === "assistant" ||
    (currentUser && userIds.includes(currentUser.id)) ? (
    <>
      <PropertyDeleteModal
        id="kt_modal_delete_confirmation_single"
        title="Emin misiniz?"
        description="Devam etmeniz halinde bu ilan kalıcı olarak silinecektir."
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
            data-kt-properties-table-filter="delete_row"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_delete_confirmation_single"
            onClick={() => setItemIdForDelete(id)}
          >
            Sil
          </a>
        </div>
      </div>
    </>
  ) : (
    ""
  )
}

export { PropertyActionsCell }
