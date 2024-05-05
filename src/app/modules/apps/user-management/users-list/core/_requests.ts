import axios, { AxiosResponse } from "axios"
import { ID, Response } from "../../../../../../_metronic/helpers"
import { User, UsersQueryResponse } from "./_models"

import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../../../../../../firebase/BaseConfig"
import { getFirestore, doc, deleteDoc } from "@firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
const functions = getFunctions()

initializeApp(firebaseConfig)
const deleteUserFromFirebase = httpsCallable(functions, "deleteUser")

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
const USER_URL = `${API_URL}/user`
const GET_USERS_URL = `${API_URL}/users/query`

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_USERS_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
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
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
}
