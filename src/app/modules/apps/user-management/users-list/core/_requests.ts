import axios, { AxiosResponse } from "axios"
import { ID, Response } from "../../../../../../_metronic/helpers"
import { User, UsersQueryResponse } from "./_models"

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
  updateDoc,
  limit,
} from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"

initializeApp(firebaseConfig)
const db = getFirestore()

const functions = getFunctions()
const deleteUserFromFirebase = httpsCallable(functions, "deleteUser")

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
const USER_URL = `${API_URL}/user`
const GET_USERS_URL = `${API_URL}/users/query`

const getUsersOld = async (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_USERS_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getUsers = async (queryString: string): Promise<UsersQueryResponse> => {
  try {
    const params = new URLSearchParams(queryString)
    const page = parseInt(params.get("page") || "1", 10)
    const itemsPerPage = parseInt(params.get("items_per_page") || "10", 10) as
      | 10
      | 30
      | 50
      | 100

    const db = getFirestore()
    const usersCollection = collection(db, "users")

    const offset = (page - 1) * itemsPerPage

    let q

    if (offset > 0) {
      q = query(
        usersCollection,
        orderBy("createdAt"),
        startAfter(offset),
        limit(itemsPerPage)
      )
    } else {
      q = query(usersCollection, orderBy("createdAt"), limit(itemsPerPage))
    }

    const snapshot = await getDocs(q)

    const users: User[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        users.push(doc.data() as User)
      }
    })

    return {
      data: users,
      payload: {
        pagination: {
          page: page,
          items_per_page: itemsPerPage,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      data: [],
      payload: {
        pagination: {
          page: 0,
          items_per_page: 10,
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
    console.error("Error fetching user:", error)
    return undefined
  }
}

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
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
    console.error("Error deleting users:", error)
    throw error
  }
}

export {
  getUsers,
  getUsersOld,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
}
