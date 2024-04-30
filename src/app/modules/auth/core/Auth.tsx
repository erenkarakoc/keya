import React, { createContext, useState, useEffect, useContext } from "react"
import { LayoutSplashScreen } from "../../../../_metronic/layout/core"
import { UserModel } from "./_models"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { firebaseAuth } from "../../../../firebase/BaseConfig"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const db = getFirestore()

type AuthContextProps = {
  currentUser: UserModel | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | null>(null)

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface WithChildren {
  children: React.ReactNode
}

const AuthProvider: React.FC<WithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDocSnapshot = await getDoc(userDocRef)

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data()
            setCurrentUser(userData as UserModel)
          } else {
            console.log("User document doesn't exist, handle accordingly")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setShowSplashScreen(false)
        }
      } else {
        setCurrentUser(undefined)
        setShowSplashScreen(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(firebaseAuth)
      setCurrentUser(undefined)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (showSplashScreen) return <LayoutSplashScreen />

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: React.FC<WithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}

export { AuthProvider, AuthInit, useAuth }
