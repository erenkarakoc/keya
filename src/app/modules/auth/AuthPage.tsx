import { Route, Routes } from "react-router-dom"
import { Registration } from "./components/Registration"
import { ForgotPassword } from "./components/ForgotPassword"
import { Login } from "./components/Login"
import { AuthLayout } from "./AuthLayout"

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route index element={<Login />} />
      <Route path="kayit" element={<Registration />} />
      <Route path="sifremi-unuttum" element={<ForgotPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export { AuthPage }
