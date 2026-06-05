const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api/admin'

const trimmedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, '')

export const API_BASE_URL = trimmedApiBaseUrl.endsWith('/api/admin')
  ? trimmedApiBaseUrl
  : `${trimmedApiBaseUrl}/api/admin`

export const WEB_API_BASE_URL = trimmedApiBaseUrl.includes('/api/admin')
  ? trimmedApiBaseUrl.replace(/\/api\/admin$/, '/api/web')
  : `${trimmedApiBaseUrl}/api/web`
