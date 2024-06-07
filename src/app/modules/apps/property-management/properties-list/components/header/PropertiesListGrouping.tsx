import { useEffect, useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { QUERIES } from "../../../../../../../_metronic/helpers"
import { useListView } from "../../../_core/ListViewProvider"
import { useQueryResponse } from "../../../_core/QueryResponseProvider"
import { deleteSelectedProperties } from "../../../_core/_requests"

import { Property } from "../../../_core/_models"

import { firebaseConfig } from "../../../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import { getFirestore, getDoc, doc } from "firebase/firestore"

import { PropertyDeleteModal } from "../../property-delete-modal/PropertyDeleteModal"

import toast from "react-hot-toast"

initializeApp(firebaseConfig)
const db = getFirestore()

const PropertiesListGrouping = () => {
  const { selected, clearSelected } = useListView()
  const [selectedPropertiesForDelete, setSelectedPropertiesForDelete] = useState<
    Property[]
  >([])
  const queryClient = useQueryClient()
  const { query } = useQueryResponse()

  const deleteSelectedItems = useMutation(
    async () => {
      deleteSelectedProperties(selected)
    },
    {
      onSuccess: () => {
        toast.success("İlan/İlanlar başarıyla silindi!")
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])

        clearSelected()
      },
      onError: (error) => {
        toast.error("İlan silinirken bir hata oluştu!")
        console.error(error)
      },
    }
  )

  useEffect(() => {
    const fetchSelectedProperties = async () => {
      const newSelectedProperties: Property[] = []

      for (const uid of selected) {
        const propertyRef = doc(db, "properties", uid as string)
        const propertyDocSnapshot = await getDoc(propertyRef)
        const propertyDataFromFirestore = propertyDocSnapshot.data() as
          | Property
          | undefined

        if (propertyDataFromFirestore) {
          newSelectedProperties.push(propertyDataFromFirestore)
        }
      }

      setSelectedPropertiesForDelete(newSelectedProperties)
    }

    fetchSelectedProperties()
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

      <PropertyDeleteModal
        id="kt_modal_delete_confirmation"
        title="Emin misiniz?"
        description="Devam etmeniz halinde aşağıdaki ilanlar kalıcı olarak
              silinecektir:"
        onApproval={async () => await deleteSelectedItems.mutateAsync()}
        selectedPropertiesForDelete={selectedPropertiesForDelete}
      />
    </div>
  )
}

export { PropertiesListGrouping }
