import { ID } from "../../../../../_metronic/helpers"
import { Office, OfficesQueryResponse } from "./_models"

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
  deleteField,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

function modifySearchParameter(queryString: string) {
  const appName = import.meta.env.VITE_APP_NAME
  const dynamicRegex = new RegExp(appName, "gi")

  queryString = queryString.replace(" ", "")
  queryString = queryString.replace("%20", "")

  return queryString.replace(/(search=)([^&]*)/, (match, p1, p2) => {
    let cleanedValue = p2.replace(dynamicRegex, "").trim()
    if (cleanedValue.length > 0) {
      cleanedValue =
        cleanedValue.charAt(0).toUpperCase() + cleanedValue.slice(1)
    }

    return p1 + cleanedValue
  })
}

const getOffices = async (
  queryString: string
): Promise<OfficesQueryResponse> => {
  try {
    queryString = modifySearchParameter(queryString)
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
    const officesCollection = collection(db, "offices")

    let q = query(officesCollection)

    // Apply search filter if search query is provided
    if (searchQuery) {
      q = query(
        officesCollection,
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
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

    const offices: Office[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        offices.push(doc.data() as Office)
      }
    })

    // Calculate pagination metadata
    const totalOfficesQuery = await getDocs(collection(db, "offices"))
    const totalOffices = totalOfficesQuery.size
    const totalPages = Math.ceil(totalOffices / itemsPerPage)
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
      data: offices,
      payload: {
        pagination: {
          page: page,
          items_per_page: itemsPerPage,
          links: links,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching offices:", error)
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

const getAllOffices = async (): Promise<Office[]> => {
  try {
    const db = getFirestore()
    const officeCollectionRef = collection(db, "offices")
    const officeDocSnapshot = await getDocs(officeCollectionRef)

    const offices: Office[] = []

    officeDocSnapshot.forEach((doc) => {
      const officeData = doc.data() as Office
      offices.push({ ...officeData, id: doc.id })
    })

    return offices
  } catch (error) {
    console.error("Error fetching offices:", error)
    return []
  }
}

const searchOffices = async (queryStr: string) => {
  try {
    const db = getFirestore()
    const officesCollectionRef = collection(db, "offices")

    queryStr = queryStr.charAt(0).toUpperCase() + queryStr.slice(1)

    const q = query(
      officesCollectionRef,
      where("name", ">=", queryStr),
      where("name", "<=", queryStr + "\uf8ff")
    )

    const officeDocSnapshot = await getDocs(q)

    const offices: Office[] = []

    officeDocSnapshot.forEach((doc) => {
      const officeData = doc.data() as Office
      offices.push({ ...officeData, id: doc.id })
    })

    return offices
  } catch (error) {
    console.error("Error fetching users by search query:", error)
    return []
  }
}

const getOfficeById = async (id: string): Promise<Office | undefined> => {
  try {
    const db = getFirestore()
    const officeDocRef = doc(db, "offices", id)
    const officeDocSnapshot = await getDoc(officeDocRef)

    if (officeDocSnapshot.exists()) {
      return officeDocSnapshot.data() as Office
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching office:", error)
    return undefined
  }
}

const getOfficeNameById = async (id: string): Promise<string | undefined> => {
  try {
    const db = getFirestore()
    const officeDocRef = doc(db, "offices", id)
    const officeDocSnapshot = await getDoc(officeDocRef)

    if (officeDocSnapshot.exists()) {
      const officeData = officeDocSnapshot.data()
      if (officeData) {
        return officeData.name as string
      }
    }
    return undefined
  } catch (error) {
    console.error("Error fetching office:", error)
    return undefined
  }
}

const removeOfficeAbout = async (officeId: string): Promise<boolean> => {
  try {
    const db = getFirestore()
    const userDocRef = doc(collection(db, "offices"), officeId)

    await updateDoc(userDocRef, {
      about: deleteField(),
    })

    console.log(
      `Successfully removed about field from user with ID: ${officeId}`
    )
    return true
  } catch (error) {
    console.error("Error removing about field:", officeId)
    return false
  }
}

const updateOffice = async (office: Office): Promise<Office | undefined> => {
  const officeDocRef = doc(db, "offices", office.id)
  await updateDoc(officeDocRef, office)
  return office
}

const deleteOffice = async (officeId: string): Promise<void> => {
  try {
    const officeRef = doc(db, "offices", officeId)
    await deleteDoc(officeRef)
  } catch (error) {
    console.error("Error deleting office documents:", error)
    throw error
  }
}

const deleteSelectedOffices = async (officeIds: Array<ID>): Promise<void> => {
  try {
    await Promise.all(
      officeIds.map(async (officeId) => {
        if (typeof officeId === "string") {
          await deleteOffice(officeId)
        } else {
          console.error("Invalid officeId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting offices:", error)
    throw error
  }
}

export {
  getOffices,
  getAllOffices,
  searchOffices,
  getOfficeById,
  getOfficeNameById,
  deleteOffice,
  deleteSelectedOffices,
  removeOfficeAbout,
  updateOffice,
}
