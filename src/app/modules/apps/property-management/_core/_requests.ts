import { ID } from "../../../../../_metronic/helpers"
import { Property, PropertiesQueryResponse } from "./_models"

import { slugify } from "../../../../../_metronic/helpers/kyHelpers"

import { firebaseConfig } from "../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  startAfter,
  getDocs,
  getDoc,
  doc,
  where,
  updateDoc,
  deleteDoc,
  limit,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

const getProperties = async (
  queryString: string
): Promise<PropertiesQueryResponse> => {
  try {
    const params = new URLSearchParams(queryString)
    const page = parseInt(params.get("page") || "1", 10)
    const itemsPerPage = parseInt(params.get("items_per_page") || "10", 10) as
      | 10
      | 30
      | 50
      | 100
    const sortField = params.get("sort") || "name"
    const sortOrder = params.get("order") || "asc"
    const searchQuery = params.get("search") || ""

    const db = getFirestore()
    const propertiesCollection = collection(db, "offices")

    let q = query(propertiesCollection)

    // Apply search filter if search query is provided
    if (searchQuery) {
      const slugifiedSearchQuery = slugify(searchQuery)

      q = query(
        propertiesCollection,
        where("name", ">=", slugifiedSearchQuery),
        where("name", "<=", slugifiedSearchQuery + "\uf8ff")
      )
    }

    // Apply sorting
    q = query(q, orderBy(sortField, sortOrder as "asc" | "desc"))

    // Paginate results
    const offset = (page - 1) * itemsPerPage
    if (offset > 0) {
      const lastVisibleDoc = await getDocs(q).then(
        (snapshot) => snapshot.docs[offset - 1]
      )
      q = query(q, startAfter(lastVisibleDoc), limit(itemsPerPage))
    } else {
      q = query(q, limit(itemsPerPage))
    }

    const snapshot = await getDocs(q)

    const properties: Property[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        properties.push(doc.data() as Property)
      }
    })

    // Calculate pagination metadata
    const totalPropertiesQuery = await getDocs(collection(db, "offices"))
    const totalProperties = totalPropertiesQuery.size
    const totalPages = Math.ceil(totalProperties / itemsPerPage)
    const nextPage = page < totalPages ? page + 1 : null
    const prevPage = page > 1 ? page - 1 : null

    // Generate pagination links
    const links = []
    if (prevPage !== null) {
      links.push({
        url: `/?page=${prevPage}&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
        label: "&laquo; Previous",
        active: false,
        page: prevPage,
      })
    }
    for (let i = 1; i <= totalPages; i++) {
      links.push({
        url: `/?page=${i}&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
        label: `${i}`,
        active: i === page,
        page: i,
      })
    }
    if (nextPage !== null) {
      links.push({
        url: `/?page=${nextPage}&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
        label: "Next &raquo;",
        active: false,
        page: nextPage,
      })
    }

    return {
      data: properties,
      payload: {
        pagination: {
          page: page,
          items_per_page: itemsPerPage,
          links: links,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching properties:", error)
    return {
      data: [],
      payload: {
        pagination: {
          page: 1,
          items_per_page: 10,
          links: [],
        },
      },
    }
  }
}

const getAllProperties = async (): Promise<Property[]> => {
  try {
    const db = getFirestore()
    const propertyCollectionRef = collection(db, "properties")
    const propertyDocSnapshot = await getDocs(propertyCollectionRef)

    const properties: Property[] = []

    propertyDocSnapshot.forEach((doc) => {
      const propertyData = doc.data() as Property
      properties.push({ ...propertyData, id: doc.id })
    })

    return properties
  } catch (error) {
    console.error("Error fetching properties:", error)
    return []
  }
}

const getPropertyById = async (id: string): Promise<Property | undefined> => {
  try {
    const db = getFirestore()
    const propertyDocRef = doc(db, "properties", id)
    const propertyDocSnapshot = await getDoc(propertyDocRef)

    if (propertyDocSnapshot.exists()) {
      return propertyDocSnapshot.data() as Property
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching property:", error)
    return undefined
  }
}

const getPropertyNameById = async (id: string): Promise<string | undefined> => {
  try {
    const db = getFirestore()
    const propertyDocRef = doc(db, "properties", id)
    const propertyDocSnapshot = await getDoc(propertyDocRef)

    if (propertyDocSnapshot.exists()) {
      const propertyData = propertyDocSnapshot.data()
      if (propertyData) {
        return propertyData.name as string
      }
    }
    return undefined
  } catch (error) {
    console.error("Error fetching property:", error)
    return undefined
  }
}

const updateProperty = async (
  property: Property
): Promise<Property | undefined> => {
  const propertyDocRef = doc(db, "offices", property.id)
  await updateDoc(propertyDocRef, property)
  return property
}

const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    const propertyRef = doc(db, "offices", propertyId)
    await deleteDoc(propertyRef)
  } catch (error) {
    console.error("Error deleting property documents:", error)
    throw error
  }
}

const deleteSelectedProperties = async (
  propertyIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      propertyIds.map(async (propertyId) => {
        if (typeof propertyId === "string") {
          await deleteProperty(propertyId)
        } else {
          console.error("Invalid propertyId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting properties:", error)
    throw error
  }
}

export {
  getProperties,
  getAllProperties,
  getPropertyById,
  getPropertyNameById,
  deleteProperty,
  deleteSelectedProperties,
  updateProperty,
}
