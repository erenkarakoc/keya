import { Link, Outlet } from "react-router-dom"

const FrontendLayout = () => {
  return (
    <>
      <div>
        <div>Frontend Layout</div>
        <Outlet />
      </div>

      <Link to="/home">Ana Sayfa</Link>
      <Link to="/offices">Ofislerimiz</Link>
      <Link to="/auth">Giriş Yap</Link>
    </>
  )
}

export { FrontendLayout }
