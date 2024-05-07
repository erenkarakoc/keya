import { useEffect, useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../core/ListViewProvider"
import { useQueryResponse } from "../../core/QueryResponseProvider"
import { deleteSelectedUsers } from "../../core/_requests"

import { UserModel } from "../../../../../auth"

import { firebaseConfig } from "../../../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import { getFirestore, getDoc, doc } from "firebase/firestore"

import { UserDeleteModal } from "../../user-delete-modal/UserDeleteModal"

initializeApp(firebaseConfig)
const db = getFirestore()

const UsersListGrouping = () => {
  const { selected, clearSelected } = useListView()
  const [selectedUsersForDelete, setSelectedUsersForDelete] = useState<
    UserModel[]
  >([])
  const queryClient = useQueryClient()
  const { query } = useQueryResponse()

  const deleteSelectedItems = useMutation(
    async () => {
      deleteSelectedUsers(selected)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
        clearSelected()
      },
    }
  )

  useEffect(() => {
    const fetchSelectedUsers = async () => {
      const newSelectedUsers: UserModel[] = []

      for (const uid of selected) {
        const userRef = doc(db, "users", uid as string)
        const userDocSnapshot = await getDoc(userRef)
        const userDataFromFirestore = userDocSnapshot.data() as
          | UserModel
          | undefined

        if (userDataFromFirestore) {
          newSelectedUsers.push(userDataFromFirestore)
        }
      }

      setSelectedUsersForDelete(newSelectedUsers)
    }

    fetchSelectedUsers()
  }, [selected])

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="fw-bolder me-5">
        <span className="me-2">{selected.length}</span> Selected
      </div>

      <button
        type="button"
        className="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_delete_confirmation"
      >
        Seçilenleri Sil
      </button>

      <UserDeleteModal
        id="kt_modal_delete_confirmation"
        title="Emin misiniz?"
        description="Devam etmeniz halinde aşağıdaki kullanıcılar kalıcı olarak
              silinecektir:"
        onApproval={async () => await deleteSelectedItems.mutateAsync()}
        selectedUsersForDelete={selectedUsersForDelete}
      ></UserDeleteModal>
    </div>
  )
}

export { UsersListGrouping }
