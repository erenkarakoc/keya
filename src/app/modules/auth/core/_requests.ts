import axios from "axios"
import { AuthModel, UserModel } from "./_models"

import { getFunctions, httpsCallable } from "firebase/functions"
import { firebaseConfig } from "../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"

const API_URL = import.meta.env.VITE_APP_API_URL
const FIREBASE_FUNCTIONS_URL = import.meta.env.VITE_APP_FIREBASE_FUNCTIONS_LOCAL_URL
const DATABASE_SECRET = import.meta.env.VITE_APP_FIREBASE_DATABASE_SECRET

const functions = getFunctions()

export const GET_USER_BY_ACCESSTOKEN_URL = `${FIREBASE_FUNCTIONS_URL}/verifyToken`
export const LOGIN_URL = `${FIREBASE_FUNCTIONS_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

initializeApp(firebaseConfig)

// Server should return AuthModel
export async function login(email: string, password: string) {
  try {
    const loginCallable = httpsCallable(functions, "login")
    const result = (await loginCallable({
      email,
      password,
      DATABASE_SECRET,
    })) as { data: { api_token: string } }

    const authData: AuthModel = { api_token: result.data.api_token }

    return authData
  } catch (error) {
    console.error("Error when logging in:", error)
    throw error
  }
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export async function getUserByToken(token: string) {
  try {
    const verifyTokenCallable = httpsCallable(functions, "verifyToken")
    const result = await verifyTokenCallable({ token })

    verifyTokenCallable({ apiToken: token }).then((result) => {
      // const userData: UserModel = {
      //   id: result.id,
      //   username: result.username,
      //   password: result.password,
      //   email: result.email,
      //   first_name: result.first_name,
      //   last_name: result.last_name,
      //   fullname: result.fullname,
      //   occupation: result.occupation,
      //   companyName: result.companyName,
      //   phone: result.phone,
      //   roles: result.roles,
      //   pic: result.pic,
      //   language: result.language,
      //   timeZone: result.timeZone,
      //   website: result.website,
      //   emailSettings: result.emailSettings,
      //   auth: result.auth,
      //   communication: result.communication,
      //   address: result.address,
      //   socialNetworks: result.socialNetworks,
      // }
      return result
    })
  } catch (error) {
    console.error("Error when logging in:", error)
    throw error
  }
}

// FIRESTORE GETTING USER

// import { signInWithEmailAndPassword } from "firebase/auth"
// import { firebaseAuth, firebaseConfig } from "../../../../firebase/BaseConfig"
// import { sendEmailVerification } from "firebase/auth"

// // Function to authenticate the user with Firebase Authentication
// async function authenticateUser() {
//   try {
//     // Sign in the user with email and password
//     const userCredential = await signInWithEmailAndPassword(
//       firebaseAuth,
//       firebaseConfig.adminEmail,
//       firebaseConfig.adminPass
//     )

//     // Retrieve the ID token from the user credential
//     const idToken = await userCredential.user.getIdToken()

//     return idToken // Return the ID token for authentication
//   } catch (err) {
//     throw new Error("An error occured.")
//   }
// }

// // Function to fetch data from Firestore using Axios
// async function getAllUsersFromFirestore() {
//   try {
//     // Authenticate the user and obtain the ID token
//     const idToken = await authenticateUser()

//     // Firestore API endpoint
//     const apiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/`

//     const config = {
//       headers: {
//         Authorization: `Bearer ${idToken}`, // Include Firebase ID token as a Bearer token
//         "Content-Type": "application/json",
//       },
//     }

//     const response = await axios.get(apiUrl, config)

//     console.log(response.data)
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function verifyAdminEmail() {
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       firebaseAuth,
//       firebaseConfig.adminEmail,
//       firebaseConfig.adminPass
//     )

//     await sendEmailVerification(userCredential.user)
//   } catch (error) {
//     console.error(error)
//   }
// }
// verifyAdminEmail()

// // Call the function to fetch data
// getAllUsersFromFirestore()
