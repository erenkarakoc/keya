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
  collection,
  setDoc,
  getDoc,
  doc,
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

    const userRef = doc(db, "users", user.uid)
    const userDocSnapshot = await getDoc(userRef)

    if (userDocSnapshot.exists()) {
      const userDataFromFirestore = userDocSnapshot.data()

      const userData: UserModel = {
        id: userDataFromFirestore?.id || user.uid,
        uid: userDataFromFirestore?.uid || user.uid,
        email: userDataFromFirestore?.email || user.email || "",
        first_name: userDataFromFirestore?.first_name || "",
        last_name: userDataFromFirestore?.last_name || "",
        photoURL: userDataFromFirestore?.photoURL || "",
        phoneNumber: userDataFromFirestore?.phone || "",
        role: userDataFromFirestore?.role || "",
        permissions: userDataFromFirestore?.permissions || [],
        address: {
          country: userDataFromFirestore?.address?.country || "",
          state: userDataFromFirestore?.address?.state || "",
          city: userDataFromFirestore?.address?.city || "",
          addressLine: userDataFromFirestore?.address?.addressLine || "",
        },
        createdAt: userDataFromFirestore?.createdAt || "",
        lastLoginAt: userDataFromFirestore?.lastLoginAt || "",
        searchIndex: userDataFromFirestore?.email,
      }

      return userData
    } else {
      console.log("User document doesn't exist in Firestore")
      throw new Error("User document not found")
    }
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
  confirmpassword: string,
  photoURL: string,
  phoneNumber: string,
  role: string,
  country: string,
  state: string,
  city: string,
  addressLine: string
): Promise<void> {
  const auth = getAuth()
  const db = getFirestore()

  try {
    if (password !== confirmpassword) {
      throw new Error("Şifre ve Şifre Tekrar alanları uyuşmalıdır")
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    const usersCollectionRef = collection(db, "users")

    await setDoc(doc(usersCollectionRef, user.uid), {
      id: user.uid,
      uid: user.uid,
      email,
      first_name,
      last_name,
      photoURL: photoURL,
      phoneNumber: phoneNumber,
      role: role,
      address: {
        country: country,
        state: state,
        city: city,
        addressLine: addressLine,
      },
      permissions: [],
      createdAt: user.metadata.creationTime || "",
      lastLoginAt: user.metadata.lastSignInTime || "",
      searchIndex: email,
    })
  } catch (error) {
    console.error("Error when registering user:", error)
    throw error
  }
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  console.log(email)
  return false
}
