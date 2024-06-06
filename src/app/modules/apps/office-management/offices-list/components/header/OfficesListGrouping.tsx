import { useEffect, useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../core/ListViewProvider"
import { useQueryResponse } from "../../core/QueryResponseProvider"
import { deleteSelectedOffices } from "../../core/_requests"

import { Office } from "../../core/_models"

import { firebaseConfig } from "../../../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import { getFirestore, getDoc, doc } from "firebase/firestore"

import { OfficeDeleteModal } from "../../office-delete-modal/OfficeDeleteModal"

import toast from "react-hot-toast"

initializeApp(firebaseConfig)
const db = getFirestore()

const OfficesListGrouping = () => {
  const { selected, clearSelected } = useListView()
  const [selectedOfficesForDelete, setSelectedOfficesForDelete] = useState<
    Office[]
  >([])
  const queryClient = useQueryClient()
  const { query } = useQueryResponse()

  const deleteSelectedItems = useMutation(
    async () => {
      deleteSelectedOffices(selected)
    },
    {
      onSuccess: () => {
        toast.success("Ofis/Ofisler başarıyla silindi!")
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])

        clearSelected()
      },
      onError: (error) => {
        toast.error("Ofis silinirken bir hata oluştu!")
        console.error(error)
      },
    }
  )

  useEffect(() => {
    const fetchSelectedOffices = async () => {
      const newSelectedOffices: Office[] = []

      for (const uid of selected) {
        const officeRef = doc(db, "offices", uid as string)
        const officeDocSnapshot = await getDoc(officeRef)
        const officeDataFromFirestore = officeDocSnapshot.data() as
          | Office
          | undefined

        if (officeDataFromFirestore) {
          newSelectedOffices.push(officeDataFromFirestore)
        }
      }

      setSelectedOfficesForDelete(newSelectedOffices)
    }

    fetchSelectedOffices()
  }, [selected])

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="fw-bolder me-5">
        <span className="me-2">{selected.length}</span>seçildi
      </div>

      <button
        type="button"
        className="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_delete_confirmation"
      >
        Seçilenleri Sil
      </button>

      <OfficeDeleteModal
        id="kt_modal_delete_confirmation"
        title="Emin misiniz?"
        description="Devam etmeniz halinde aşağıdaki kullanıcılar kalıcı olarak
              silinecektir:"
        onApproval={async () => await deleteSelectedItems.mutateAsync()}
        selectedOfficesForDelete={selectedOfficesForDelete}
      ></OfficeDeleteModal>
    </div>
  )
}

export { OfficesListGrouping }
