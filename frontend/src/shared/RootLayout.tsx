import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

export function RootLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(!!localStorage.getItem("token"))
    document.title = "Nordstay"
  }, [loc.pathname])

  function logout() {
    localStorage.removeItem("token")
    setAuthed(false)
    nav("/login")
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-40 bg-[#eef2ff] border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="text-xl font-semibold tracking-tight">Nordstay</NavLink>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className="hover:text-primary">Hem</NavLink>
            <NavLink to="/bookings" className="hover:text-primary">Mina bokningar</NavLink>
            {authed ? (
              <>
                <NavLink to="/host/create" className="hover:text-primary">Skapa boende</NavLink>
                <button onClick={logout} className="hover:text-primary">Logga ut</button>
              </>
            ) : (
              <>
                <NavLink to="/register" className="hover:text-primary">Skapa konto</NavLink>
                <NavLink to="/login" className="hover:text-primary">Logga in</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-subtext">
          © {new Date().getFullYear()} Nordstay
        </div>
      </footer>
    </div>
  )
}
