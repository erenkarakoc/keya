import { ID } from "../../../../../../_metronic/helpers"
import { User, UsersQueryResponse } from "./_models"

import { slugify } from "../../../../../../_metronic/helpers/kyHelpers"

import { firebaseConfig } from "../../../../../../firebase/BaseConfig"
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
} from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { UserModel } from "../../../../auth"
import toast from "react-hot-toast"

initializeApp(firebaseConfig)
const db = getFirestore()

const functions = getFunctions()
const deleteUserFromFirebase = httpsCallable(functions, "deleteUser")

const getUsers = async (queryString: string): Promise<UsersQueryResponse> => {
  try {
    const params = new URLSearchParams(queryString)
    const page = parseInt(params.get("page") || "1", 10)
    const itemsPerPage = parseInt(params.get("items_per_page") || "10", 10) as
      | 10
      | 30
      | 50
      | 100
    const sortField = params.get("sort") || "createdAt" // Default sort field
    const sortOrder = params.get("order") || "asc" // Default sort order
    const searchQuery = params.get("search") || "" // Search input value

    const db = getFirestore()
    const usersCollection = collection(db, "users")

    let q = query(usersCollection)

    // Apply search filter if search query is provided
    if (searchQuery) {
      const slugifiedSearchQuery = slugify(searchQuery)

      console.log(slugifiedSearchQuery)

      q = query(
        usersCollection,
        where("searchIndex", ">=", slugifiedSearchQuery),
        where("searchIndex", "<=", slugifiedSearchQuery + "\uf8ff")
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

    const users: User[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        users.push(doc.data() as User)
      }
    })

    // Calculate pagination metadata
    const totalUsersQuery = await getDocs(collection(db, "users"))
    const totalUsers = totalUsersQuery.size
    const totalPages = Math.ceil(totalUsers / itemsPerPage)
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
      data: users,
      payload: {
        pagination: {
          page: page,
          items_per_page: itemsPerPage,
          links: links,
        },
      },
    }
  } catch (error) {
    toast.error("Kullanıcılar yüklenemedi! Lütfen daha sonra tekrar deneyin.")
    console.error("Error fetching users:", error)
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

const getUserById = async (id: ID): Promise<User | undefined> => {
  try {
    if (!id) {
      return undefined
    }
    const db = getFirestore()
    const userDocRef = doc(db, "users", id as string)
    const userDocSnapshot = await getDoc(userDocRef)

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data() as User
    } else {
      return undefined
    }
  } catch (error) {
    toast.error("Kullanıcı yüklenemedi! Lütfen daha sonra tekrar deneyin.")
    console.error("Error fetching user:", error)
    return undefined
  }
}

const getUsersById = async (ids: string[]): Promise<UserModel[]> => {
  try {
    if (!ids || ids.length === 0) {
      return []
    }

    const db = getFirestore()
    const users: UserModel[] = []

    for (const id of ids) {
      const userDocRef = doc(db, "users", id)
      const userDocSnapshot = await getDoc(userDocRef)

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as UserModel
        users.push(userData)
      }
    }

    return users
  } catch (error) {
    toast.error("Kullanıcılar yüklenemedi! Lütfen daha sonra tekrar deneyin.")
    console.error("Error fetching users:", error)
    return []
  }
}

const updateUser = async (user: User): Promise<User | undefined> => {
  const userDocRef = doc(db, "users", user.id)
  await updateDoc(userDocRef, user)
  return user
}

const deleteUser = async (userId: ID): Promise<void> => {
  try {
    deleteUserFromFirebase({ uid: userId })
  } catch (error) {
    toast.error("Kullanıcı silinemedi! Lütfen daha sonra tekrar deneyin.")
    console.error("Error deleting user documents:", error)
    throw error
  }
}

const deleteSelectedUsers = async (userIds: Array<ID>): Promise<void> => {
  try {
    await Promise.all(
      userIds.map((uid) => {
        deleteUserFromFirebase({ uid: uid })
      })
    )
  } catch (error) {
    toast.error("Kullanıcılar silinemedi! Lütfen daha sonra tekrar deneyin.")
    console.error("Error deleting users:", error)
    throw error
  }
}

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  getUsersById,
  updateUser,
}
