import { ID, PaginationState } from "../../../../../_metronic/helpers"
import { User, UsersQueryResponse } from "./_models"

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
  limit,
  deleteField,
  deleteDoc,
} from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"

initializeApp(firebaseConfig)
const db = getFirestore()

const functions = getFunctions()
const deleteUserFromFirebase = httpsCallable(functions, "deleteUser")

const getAllUsers = async (): Promise<User[]> => {
  try {
    const db = getFirestore()
    const usersCollectionRef = collection(db, "users")
    const userDocSnapshot = await getDocs(usersCollectionRef)

    const users: User[] = []

    userDocSnapshot.forEach((doc) => {
      const userData = doc.data() as User
      users.push({ ...userData, id: doc.id })
    })

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

const getUsers = async (queryString: string): Promise<UsersQueryResponse> => {
  try {
    const db = getFirestore()
    const params = new URLSearchParams(queryString)
    const page = parseInt(params.get("page") || "1", 10)
    const itemsPerPage = parseInt(params.get("items_per_page") || "10", 10) as
      | 10
      | 30
      | 50
      | 100
    const sortField = params.get("sort") || "createdAt"
    const sortOrder = params.get("order") === "desc" ? "desc" : "asc"
    const searchQuery = params.get("search") || ""

    let usersQuery = query(collection(db, "users"))

    // Apply search filter
    if (searchQuery) {
      const slugifiedSearchQuery = slugify(searchQuery)
      usersQuery = query(
        usersQuery,
        where("email", ">=", slugifiedSearchQuery),
        where("email", "<=", slugifiedSearchQuery + "\uf8ff")
      )

      console.log(usersQuery)
    }

    // Apply sorting
    usersQuery = query(usersQuery, orderBy(sortField, sortOrder))

    // Get all documents for pagination purposes
    const allDocsSnapshot = await getDocs(usersQuery)
    const totalUsers = allDocsSnapshot.size
    const totalPages = Math.ceil(totalUsers / itemsPerPage)

    // Paginate results
    const offset = (page - 1) * itemsPerPage
    if (offset > 0 && offset < totalUsers) {
      const lastVisibleDoc = allDocsSnapshot.docs[offset - 1]
      usersQuery = query(
        usersQuery,
        startAfter(lastVisibleDoc),
        limit(itemsPerPage)
      )
    } else {
      usersQuery = query(usersQuery, limit(itemsPerPage))
    }

    const snapshot = await getDocs(usersQuery)
    const users: User[] = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as User)
    )

    // Generate pagination links
    const links = generatePaginationLinks(
      page,
      totalPages,
      itemsPerPage,
      sortField,
      sortOrder,
      searchQuery
    )

    const response: UsersQueryResponse = {
      data: users,
      payload: {
        pagination: {
          page,
          items_per_page: itemsPerPage,
          links,
        },
        message: "Users fetched successfully",
      },
    }

    return response
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      data: [],
      payload: {
        message: "Error fetching users",
        errors: { general: [] },
        pagination: { page: 1, items_per_page: 10, links: [] },
      },
    }
  }
}

const generatePaginationLinks = (
  page: number,
  totalPages: number,
  itemsPerPage: number,
  sortField: string,
  sortOrder: string,
  searchQuery: string
): PaginationState["links"] => {
  const links = []

  if (page > 1) {
    links.push({
      url: `/?page=${
        page - 1
      }&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
      label: "&laquo; Previous",
      active: false,
      page: page - 1,
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

  if (page < totalPages) {
    links.push({
      url: `/?page=${
        page + 1
      }&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
      label: "Next &raquo;",
      active: false,
      page: page + 1,
    })
  }

  return links
}

const searchUsers = async (queryStr: string) => {
  try {
    const db = getFirestore()
    const usersCollectionRef = collection(db, "users")

    const q = query(
      usersCollectionRef,
      where("email", ">=", slugify(queryStr)),
      where("email", "<=", slugify(queryStr) + "\uf8ff")
    )

    const userDocSnapshot = await getDocs(q)

    const users: User[] = []

    userDocSnapshot.forEach((doc) => {
      const userData = doc.data() as User
      users.push({ ...userData, id: doc.id })
    })

    return users
  } catch (error) {
    console.error("Error fetching users by search query:", error)
    return []
  }
}

const getUserById = async (id: ID): Promise<User | undefined> => {
  try {
    if (!id) {
      return undefined
    }
    const userDocRef = doc(db, "users", id as string)
    const userDocSnapshot = await getDoc(userDocRef)

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data() as User
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return undefined
  }
}

const getUsersById = async (ids: string[]): Promise<User[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const users: User[] = []

    for (const id of ids) {
      const userDocRef = doc(db, "users", id)
      const userDocSnapshot = await getDoc(userDocRef)

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as User
        users.push(userData)
      }
    }

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

const getUsersByRole = async (role: string): Promise<User[] | undefined> => {
  try {
    const usersCollection = collection(db, "users")

    const q = query(usersCollection, where("role", "==", role))

    const snapshot = await getDocs(q)

    const users: User[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        users.push(doc.data() as User)
      }
    })

    return users
  } catch (error) {
    console.error("Error fetching users by role:", error)
    return undefined
  }
}

const getUsersByOfficeId = async (officeId: string): Promise<User[] | undefined> => {
  try {
    const usersCollection = collection(db, "users")

    const q = query(usersCollection, where("officeId", "==", officeId))

    const snapshot = await getDocs(q)

    const users: User[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        users.push(doc.data() as User)
      }
    })

    return users
  } catch (error) {
    console.error("Error fetching users by officeId:", error)
    return undefined
  }
}

const getUserEmails = async (): Promise<string[]> => {
  try {
    const db = getFirestore()
    const usersCollectionRef = collection(db, "users")
    const userDocSnapshot = await getDocs(usersCollectionRef)

    const userEmails: string[] = []

    userDocSnapshot.forEach((doc) => {
      const userData = doc.data() as User
      if (userData.email) {
        userEmails.push(userData.email)
      }
    })

    return userEmails
  } catch (error) {
    console.error("Error fetching user emails:", error)
    return []
  }
}

const getOfficeIdByUserId = async (id: string): Promise<string | undefined> => {
  try {
    if (!id) {
      console.error("Invalid user ID")
      return ""
    }

    const userDocRef = doc(db, "users", id)
    const userDocSnapshot = await getDoc(userDocRef)

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data()
      return userData.officeId
    } else {
      console.error("User document with the provided ID does not exist")
      return ""
    }
  } catch (error) {
    console.error("Error fetching user office ID:", error)
    return ""
  }
}

const addUsersToOffice = async (officeId: string, userIds: string[]) => {
  try {
    const officeDocRef = doc(db, "offices", officeId)
    const officeDocSnap = await getDoc(officeDocRef)

    if (officeDocSnap.exists()) {
      const officeData = officeDocSnap.data()

      const existingUserIds = new Set(officeData.users)
      const newUsers = userIds.filter((userId) => !existingUserIds.has(userId))
      const updatedUsers = [...officeData.users, ...newUsers]

      await updateDoc(officeDocRef, { users: updatedUsers })
    } else {
      console.error("Office document with the provided ID does not exist")
    }
  } catch (error) {
    console.error("Error adding users to office:", error)
  }
}

const removeUsersFromOffice = async (officeId: string, userIds: string[]) => {
  try {
    const officeDocRef = doc(db, "offices", officeId)
    const officeDocSnap = await getDoc(officeDocRef)

    if (officeDocSnap.exists()) {
      const officeData = officeDocSnap.data()

      const updatedUsers = officeData.users.filter(
        (userId: string) => !userIds.includes(userId)
      )

      await updateDoc(officeDocRef, { users: updatedUsers })
    } else {
      console.error("Office document with the provided ID does not exist")
    }
  } catch (error) {
    console.error("Error removing users from office:", error)
  }
}

const removeUserAbout = async (userId: string): Promise<boolean> => {
  try {
    const db = getFirestore()
    const userDocRef = doc(collection(db, "users"), userId)

    await updateDoc(userDocRef, {
      about: deleteField(),
    })

    console.log(`Successfully removed about field from user with ID: ${userId}`)
    return true
  } catch (error) {
    console.error("Error removing about field:", error)
    return false
  }
}

const updateUser = async (user: User): Promise<User | undefined> => {
  const userDocRef = doc(db, "users", user.id)
  await updateDoc(userDocRef, user)
  return user
}

const deleteUser = async (userId: ID): Promise<void> => {
  try {
    if (!userId) {
      console.error("Provide a user ID")
      return
    }

    const userDocRef = doc(db, "users", userId.toString())

    await deleteDoc(userDocRef)

    const officeId = await getOfficeIdByUserId(userId.toString())
    if (officeId) await removeUsersFromOffice(officeId, [userId.toString()])

    await deleteUserFromFirebase({ uid: userId.toString() })
  } catch (error) {
    console.error("Error deleting user documents:", error)
    throw error
  }
}

const deleteSelectedUsers = async (userIds: Array<ID>): Promise<void> => {
  try {
    await Promise.all(
      userIds.map(async (userId: ID) => {
        if (!userId) {
          console.error("Provide a user ID")
          return
        }

        const userDocRef = doc(db, "users", userId.toString())

        await deleteDoc(userDocRef)

        const officeId = await getOfficeIdByUserId(userId.toString())
        if (officeId) await removeUsersFromOffice(officeId, [userId.toString()])

        await deleteUserFromFirebase({ uid: userId.toString() })
      })
    )
  } catch (error) {
    console.error("Error deleting users:", error)
    throw error
  }
}

export {
  getAllUsers,
  getUsers,
  searchUsers,
  getUserById,
  getUsersById,
  getUsersByRole,
  getUsersByOfficeId,
  getUserEmails,
  getOfficeIdByUserId,
  addUsersToOffice,
  removeUsersFromOffice,
  removeUserAbout,
  deleteUser,
  deleteSelectedUsers,
  updateUser,
}
