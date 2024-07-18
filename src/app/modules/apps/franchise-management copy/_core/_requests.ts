import { ID } from "../../../../../_metronic/helpers"
import { FranchiseApplication } from "./_models"

import { firebaseConfig } from "../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

const newFranchiseApplication = async (application: FranchiseApplication) => {
  try {
    const FranchiseApplicationDocRef = await addDoc(
      collection(db, "franchise-applications"),
      application
    )

    await updateDoc(FranchiseApplicationDocRef, {
      id: FranchiseApplicationDocRef.id,
      ...application,
    })

    return { id: FranchiseApplicationDocRef.id, ...application }
  } catch (error) {
    console.error("Error adding Franchise Application: ", error)
    throw error
  }
}

const getAllFranchiseApplications = async (): Promise<
  FranchiseApplication[]
> => {
  try {
    const db = getFirestore()
    const FranchiseApplicationCollectionRef = collection(
      db,
      "franchise-applications"
    )
    const franchiseApplicationDocSnapshot = await getDocs(
      FranchiseApplicationCollectionRef
    )

    const franchiseApplications: FranchiseApplication[] = []

    franchiseApplicationDocSnapshot.forEach((doc) => {
      const franchiseApplicationData = doc.data() as FranchiseApplication
      franchiseApplications.push({ ...franchiseApplicationData, id: doc.id })
    })

    return franchiseApplications
  } catch (error) {
    console.error("Error fetching Franchise Applications:", error)
    return []
  }
}

const getFranchiseApplicationById = async (
  id: string
): Promise<FranchiseApplication | undefined> => {
  try {
    const db = getFirestore()
    const FranchiseApplicationDocRef = doc(db, "franchise-applications", id)
    const FranchiseApplicationDocSnapshot = await getDoc(
      FranchiseApplicationDocRef
    )

    if (FranchiseApplicationDocSnapshot.exists()) {
      return FranchiseApplicationDocSnapshot.data() as FranchiseApplication
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching FranchiseApplications:", error)
    return undefined
  }
}

const deleteFranchiseApplication = async (
  FranchiseApplicationId: string
): Promise<void> => {
  try {
    const FranchiseApplicationRef = doc(
      db,
      "franchise-applications",
      FranchiseApplicationId
    )
    await deleteDoc(FranchiseApplicationRef)
  } catch (error) {
    console.error("Error deleting FranchiseApplication documents:", error)
    throw error
  }
}

const deleteSelectedFranchiseApplications = async (
  FranchiseApplicationIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      FranchiseApplicationIds.map(async (FranchiseApplicationId) => {
        if (typeof FranchiseApplicationId === "string") {
          await deleteFranchiseApplication(FranchiseApplicationId)
        } else {
          console.error("Invalid FranchiseApplicationId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting FranchiseApplications:", error)
    throw error
  }
}

export {
  newFranchiseApplication,
  getAllFranchiseApplications,
  getFranchiseApplicationById,
  deleteFranchiseApplication,
  deleteSelectedFranchiseApplications,
}
