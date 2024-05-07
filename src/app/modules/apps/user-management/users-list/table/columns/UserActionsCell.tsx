import clsx from "clsx"
import { FC, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../core/ListViewProvider"
import { useQueryResponse } from "../../core/QueryResponseProvider"
import { deleteUser } from "../../core/_requests"
import { User } from "../../core/_models"
import { firebaseConfig } from "../../../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import { getFirestore, getDoc, doc } from "firebase/firestore"
import { ConfirmationModal } from "../../../../../../../_metronic/partials/modals/confirmation-model/ConfirmationModal"

initializeApp(firebaseConfig)
const db = getFirestore()

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate } = useListView()
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<
    User | undefined
  >()
  const [userDataLoaded, setUserDataLoaded] = useState(false)
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()

  const getUserData = async () => {
    console.log(id)
    const userRef = doc(db, "users", id as string)
    const userDocSnapshot = await getDoc(userRef)
    const userDataFromFirestore = userDocSnapshot.data() as User | undefined
    setSelectedUserForDelete(userDataFromFirestore)
    setUserDataLoaded(true)
    console.log(userDataLoaded)
  }

  const openEditModal = () => setItemIdForUpdate(id)
  const handleOnDecline = () => setUserDataLoaded(false)

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
    },
  })

  const userForDeletion = () => {
    if (!userDataLoaded) {
      return <div className="text-center">...</div>
    }

    const initials =
      selectedUserForDelete?.first_name && selectedUserForDelete?.last_name
        ? selectedUserForDelete?.first_name.charAt(0) +
          selectedUserForDelete?.last_name.charAt(0)
        : ""

    return (
      <div className="confirmation-modal-users">
        {selectedUserForDelete && (
          <div className="d-flex align-items-center confirmation-modal-user">
            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
              <a href="#">
                {selectedUserForDelete.photoURL ? (
                  <div className="symbol-label">
                    <img
                      src={`${selectedUserForDelete.photoURL}`}
                      alt={selectedUserForDelete.first_name}
                      className="w-100"
                    />
                  </div>
                ) : (
                  <div className={clsx("symbol-label fs-3")}>{initials}</div>
                )}
              </a>
            </div>
            <div className="d-flex flex-column">
              <a
                href="#"
                className="text-gray-800 text-hover-primary mb-1"
                style={{ textAlign: "left" }}
              >
                {selectedUserForDelete.first_name}{" "}
                {selectedUserForDelete.last_name}
              </a>
              <span>{selectedUserForDelete.email}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <ConfirmationModal
        id="kt_modal_delete_confirmation_single"
        title="Emin misiniz?"
        description="Devam etmeniz halinde aşağıdaki kullanıcı kalıcı olarak silinecektir:"
        onApproval={async () => await deleteItem.mutateAsync()}
        onDecline={handleOnDecline}
        ExtraComponent={userForDeletion}
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
            onClick={getUserData}
          >
            Sil
          </a>
        </div>
      </div>
    </>
  )
}

export { UserActionsCell }
