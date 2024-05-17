import { UserModel } from "./_models"

import { firebaseConfig } from "../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

import { getFirestore, getDoc, doc } from "firebase/firestore"
import toast from "react-hot-toast"

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
        firstName: userDataFromFirestore?.firstName || "",
        lastName: userDataFromFirestore?.lastName || "",
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
    toast.error("Bir sorun oluştu! Lütfen daha sonra tekrar deneyin.")
    console.error("Error when logging in:", error)
    throw error
  }
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  console.log(email)
  return false
}
