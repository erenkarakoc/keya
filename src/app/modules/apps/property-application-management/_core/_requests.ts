import { ID } from "../../../../../_metronic/helpers"
import { PropertyApplication } from "./_models"

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

const newPropertyApplication = async (application: PropertyApplication) => {
  try {
    const applicationDocRef = await addDoc(
      collection(db, "property-applications"),
      application
    )

    await updateDoc(applicationDocRef, {
      id: applicationDocRef.id,
      ...application,
    })

    return { id: applicationDocRef.id, ...application }
  } catch (error) {
    console.error("Error adding Property Application: ", error)
    throw error
  }
}

const getAllPropertyApplications = async (): Promise<PropertyApplication[]> => {
  try {
    const db = getFirestore()
    const PropertyApplicationCollectionRef = collection(
      db,
      "property-applications"
    )
    const propertyApplicationDocSnapshot = await getDocs(
      PropertyApplicationCollectionRef
    )

    const propertyApplications: PropertyApplication[] = []

    propertyApplicationDocSnapshot.forEach((doc) => {
      const propertyApplicationData = doc.data() as PropertyApplication
      propertyApplications.push({ ...propertyApplicationData, id: doc.id })
    })

    return propertyApplications
  } catch (error) {
    console.error("Error fetching Property Applications:", error)
    return []
  }
}

const getPropertyApplicationById = async (
  id: string
): Promise<PropertyApplication | undefined> => {
  try {
    const db = getFirestore()
    const PropertyApplicationDocRef = doc(db, "property-applications", id)
    const PropertyApplicationDocSnapshot = await getDoc(
      PropertyApplicationDocRef
    )

    if (PropertyApplicationDocSnapshot.exists()) {
      return PropertyApplicationDocSnapshot.data() as PropertyApplication
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching PropertyApplications:", error)
    return undefined
  }
}

const deletePropertyApplication = async (
  PropertyApplicationId: string
): Promise<void> => {
  try {
    const PropertyApplicationRef = doc(
      db,
      "property-applications",
      PropertyApplicationId
    )
    await deleteDoc(PropertyApplicationRef)
  } catch (error) {
    console.error("Error deleting PropertyApplication documents:", error)
    throw error
  }
}

const deleteSelectedPropertyApplications = async (
  PropertyApplicationIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      PropertyApplicationIds.map(async (PropertyApplicationId) => {
        if (typeof PropertyApplicationId === "string") {
          await deletePropertyApplication(PropertyApplicationId)
        } else {
          console.error("Invalid PropertyApplicationId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting PropertyApplications:", error)
    throw error
  }
}

export {
  newPropertyApplication,
  getAllPropertyApplications,
  getPropertyApplicationById,
  deletePropertyApplication,
  deleteSelectedPropertyApplications,
}
