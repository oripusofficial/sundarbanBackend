import { useCallback, useEffect, useMemo, useState } from 'react'

import { API_BASE_URL } from '../config/api'
import AuthContext from './authContext'

const TOKEN_KEY = 'sundarban_admin_token'

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(token))

  useEffect(() => {
    let isMounted = true

    async function fetchCurrentUser() {
      if (!token) {
        if (isMounted) {
          setIsCheckingAuth(false)
          setUser(null)
        }
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Session expired')
        }

        if (isMounted) {
          setUser(result.user)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        if (isMounted) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    fetchCurrentUser()

    return () => {
      isMounted = false
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Unable to login')
    }

    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)

    return result.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const authFetch = useCallback(
    async (url, options = {}) => {
      const headers = new Headers(options.headers || {})

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        logout()
      }

      return response
    },
    [logout, token],
  )

  const value = useMemo(
    () => ({
      authFetch,
      isAuthenticated: Boolean(token),
      isCheckingAuth,
      login,
      logout,
      token,
      user,
    }),
    [authFetch, isCheckingAuth, login, logout, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
