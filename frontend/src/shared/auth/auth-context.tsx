import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextValue {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('token')
  )

  const setToken = (newToken: string | null) => {
    if (newToken === null) {
      localStorage.removeItem('token')
    } else {
      localStorage.setItem('token', newToken)
    }
    setTokenState(newToken)
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
