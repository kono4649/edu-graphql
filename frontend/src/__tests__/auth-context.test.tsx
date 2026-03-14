import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { AuthProvider, useAuth } from '@/shared/auth/auth-context'

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initial token is null when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.token).toBeNull()
  })

  it('setToken stores token in localStorage and updates state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.setToken('test-jwt-token')
    })

    expect(result.current.token).toBe('test-jwt-token')
    expect(localStorage.getItem('token')).toBe('test-jwt-token')
  })

  it('setToken(null) removes token from localStorage', () => {
    localStorage.setItem('token', 'existing-token')
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.setToken(null)
    })

    expect(result.current.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('logout clears token from state and localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.setToken('some-token')
    })
    expect(result.current.token).toBe('some-token')

    act(() => {
      result.current.logout()
    })

    expect(result.current.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('initializes token from localStorage on mount', () => {
    localStorage.setItem('token', 'pre-existing-token')
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.token).toBe('pre-existing-token')
  })
})

describe('useAuth outside AuthProvider', () => {
  it('throws an error when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within AuthProvider')
  })
})
