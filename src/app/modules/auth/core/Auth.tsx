import { FC, useState, useEffect, createContext, useContext } from "react"
import { LayoutSplashScreen } from "../../../../_metronic/layout/core"
import { UserModel } from "./_models"
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth"
import { firebaseAuth } from "../../../../firebase/BaseConfig"
import { getFirestore, getDoc, doc } from "firebase/firestore"

const db = getFirestore()

type AuthContextProps = {
  currentUser: UserModel | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

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

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    setShowSplashScreen(false)
  }, [currentUser])

  // Show splash screen until authentication is initialized
  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, AuthInit, useAuth }
