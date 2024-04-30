import { UserModel } from "./_models"

import { firebaseConfig } from "../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

export async function login(
  email: string,
  password: string
): Promise<UserModel> {
  const auth = getAuth()

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    const userDocRef = doc(db, "users", user.uid)
    const userDocSnapshot = await getDoc(userDocRef)
    const userDataFromFirestore = userDocSnapshot.data()

    const userData: UserModel = {
      id: userDataFromFirestore?.id || 0,
      uid: userDataFromFirestore?.uid || user.uid,
      email: userDataFromFirestore?.email || user.email || "",
      emailVerified:
        userDataFromFirestore?.emailVerified || user.emailVerified || false,
      first_name: userDataFromFirestore?.first_name || "",
      last_name: userDataFromFirestore?.last_name || "",
      fullname: userDataFromFirestore?.fullname || "",
      providerData: userDataFromFirestore?.providerData || [],
      occupation: userDataFromFirestore?.occupation || "",
      phone: userDataFromFirestore?.phone || "",
      roles: userDataFromFirestore?.roles || [],
      pic: userDataFromFirestore?.pic || "",
      emailSettings: {
        emailNotification:
          userDataFromFirestore?.emailSettings?.emailNotification || true,
        sendCopyToPersonalEmail:
          userDataFromFirestore?.emailSettings?.sendCopyToPersonalEmail ||
          false,
        activityRelatesEmail: {
          youHaveNewNotifications:
            userDataFromFirestore?.emailSettings?.activityRelatesEmail
              ?.youHaveNewNotifications || true,
          youAreSentADirectMessage:
            userDataFromFirestore?.emailSettings?.activityRelatesEmail
              ?.youAreSentADirectMessage || true,
          someoneAddsYouAsAsAConnection:
            userDataFromFirestore?.emailSettings?.activityRelatesEmail
              ?.someoneAddsYouAsAsAConnection || true,
          uponNewOrder:
            userDataFromFirestore?.emailSettings?.activityRelatesEmail
              ?.uponNewOrder || false,
          newMembershipApproval:
            userDataFromFirestore?.emailSettings?.activityRelatesEmail
              ?.newMembershipApproval || true,
          memberRegistration:
            userDataFromFirestore?.emailSettings?.activityRelatesEmail
              ?.memberRegistration || false,
        },
      },
      address: {
        addressLine: userDataFromFirestore?.address?.addressLine || "",
        city: userDataFromFirestore?.address?.city || "",
        state: userDataFromFirestore?.address?.state || "",
        postCode: userDataFromFirestore?.address?.postCode || "",
      },
      createdAt: userDataFromFirestore?.createdAt || "",
      lastLoginAt: userDataFromFirestore?.lastLoginAt || "",
    }

    return userData
  } catch (error) {
    console.error("Error when logging in:", error)
    throw error
  }
}

export async function register(
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  password_confirmation: string
): Promise<void> {
  const auth = getAuth()
  const db = getFirestore()

  try {
    if (password !== password_confirmation) {
      throw new Error("Passwords do not match")
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    const usersCollectionRef = collection(db, "users")

    await addDoc(usersCollectionRef, {
      first_name,
      last_name,
      email: user.email || "",
      emailVerified: user.emailVerified || false,
      id: user.uid,
      uid: user.uid,
      providerData: user.providerData || [],
      createdAt: user.metadata.creationTime || "",
      lastLoginAt: user.metadata.lastSignInTime || "",
      occupation: "",
      phone: "",
      roles: [],
      pic: "",
      emailSettings: {
        emailNotification: true,
        sendCopyToPersonalEmail: false,
        activityRelatesEmail: {
          youHaveNewNotifications: true,
          youAreSentADirectMessage: true,
          someoneAddsYouAsAsAConnection: true,
          uponNewOrder: false,
          newMembershipApproval: true,
          memberRegistration: false,
        },
      },
      address: {
        addressLine: "",
        city: "",
        state: "",
        postCode: "",
      },
    })
  } catch (error) {
    console.error("Error when registering user:", error)
    throw error // Let the error propagate naturally
  }
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  console.log(email)
  return false
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
