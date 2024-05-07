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
import { slugify } from "../../../../_metronic/helpers/kyHelpers"

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
        emailVerified:
          userDataFromFirestore?.emailVerified || user.emailVerified || false,
        first_name: userDataFromFirestore?.first_name || "",
        last_name: userDataFromFirestore?.last_name || "",
        photoURL: userDataFromFirestore?.photoURL || "",
        phoneNumber: userDataFromFirestore?.phone || "",
        role: userDataFromFirestore?.role || "",
        permissions: userDataFromFirestore?.permissions || [],
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
        searchIndex:
          userDataFromFirestore?.email +
          " " +
          slugify(
            userDataFromFirestore?.first_name + userDataFromFirestore?.last_name
          ),
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

    await setDoc(doc(usersCollectionRef, user.uid), {
      id: user.uid,
      uid: user.uid,
      email,
      emailVerified: user.emailVerified || false,
      first_name,
      last_name,
      photoURL: "",
      phoneNumber: "",
      role: "",
      permissions: [],
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
      createdAt: user.metadata.creationTime || "",
      lastLoginAt: user.metadata.lastSignInTime || "",
      searchIndex: email + " " + slugify(first_name + last_name),
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
