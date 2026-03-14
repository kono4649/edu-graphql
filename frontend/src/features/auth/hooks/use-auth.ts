import { useState } from 'react'
import { useAuth } from '@/shared/auth/auth-context'

const API_BASE = import.meta.env.VITE_API_BASE as string

interface AuthError {
  detail: string
}

interface UseAuthActionsReturn {
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err: AuthError = await res.json()
    throw new Error(err.detail ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

export function useAuthActions(): UseAuthActionsReturn {
  const { setToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await postJson<{ access_token: string }>(
        `${API_BASE}/auth/login`,
        { email, password }
      )
      setToken(data.access_token)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await postJson<{ access_token: string }>(
        `${API_BASE}/auth/register`,
        { email, password }
      )
      setToken(data.access_token)
    } catch (e) {
      setError(e instanceof Error ? e.message : '登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, login, register }
}
