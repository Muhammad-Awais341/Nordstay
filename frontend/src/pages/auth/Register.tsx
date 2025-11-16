import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useNavigate, NavLink } from 'react-router-dom'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const nav = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Create user in backend
      await api.post('/auth/register', { name, email, password })

      // Automatically log the user in
      const res = await api.post('/auth/login', { email, password })

      // Save token for authentication
      localStorage.setItem('token', res.data.token)

      // Redirect to home
      nav('/')
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? 'Registration failed')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-semibold">Skapa konto</h1>

      {err && <p className="text-red-600 text-sm">{err}</p>}

      <Input
        label="Namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="E-post"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Lösenord"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full">
        Skapa konto
      </Button>

      <p className="text-sm text-subtext">
        Har du redan konto?{' '}
        <NavLink to="/login" className="text-primary">
          Logga in
        </NavLink>
      </p>
    </form>
  )
}
