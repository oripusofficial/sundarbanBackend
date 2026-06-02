import { AlertTriangle, CheckCircle2, Copy, Play } from 'lucide-react'
import { useMemo, useState } from 'react'

import CodeBlock from './CodeBlock'

const endpointOptions = [
  {
    description: 'Fetch all published images.',
    label: 'List gallery images',
    method: 'GET',
    path: '/gallery',
    value: 'list',
  },
  {
    description: 'Fetch one published image by ID.',
    label: 'Get gallery image',
    method: 'GET',
    path: '/gallery/:id',
    value: 'detail',
  },
]

function ApiPlayground({ baseUrl }) {
  const [endpoint, setEndpoint] = useState('list')
  const [category, setCategory] = useState('')
  const [imageId, setImageId] = useState('')
  const [response, setResponse] = useState(null)
  const [status, setStatus] = useState(null)
  const [duration, setDuration] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const selectedEndpoint = endpointOptions.find((option) => option.value === endpoint)

  const requestUrl = useMemo(() => {
    if (endpoint === 'detail') {
      return `${baseUrl}/gallery/${imageId.trim() || ':id'}`
    }

    const params = new URLSearchParams()

    if (category.trim()) {
      params.set('category', category.trim())
    }

    const query = params.toString()
    return `${baseUrl}/gallery${query ? `?${query}` : ''}`
  }, [baseUrl, category, endpoint, imageId])

  async function runRequest() {
    if (endpoint === 'detail' && !imageId.trim()) {
      setError('Enter an image ID before running this request.')
      setResponse(null)
      setStatus(null)
      setDuration(null)
      return
    }

    setIsLoading(true)
    setError('')
    setCopied(false)

    const startedAt = performance.now()

    try {
      const fetchUrl =
        endpoint === 'detail' ? `${baseUrl}/gallery/${imageId.trim()}` : requestUrl
      const result = await fetch(fetchUrl)
      const data = await result.json()

      setStatus(result.status)
      setDuration(Math.round(performance.now() - startedAt))
      setResponse(data)

      if (!result.ok) {
        setError(data.message || 'Request failed')
      }
    } catch (err) {
      setStatus(null)
      setDuration(Math.round(performance.now() - startedAt))
      setResponse({
        message: err.message,
      })
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function copyRequestUrl() {
    await navigator.clipboard.writeText(requestUrl)
    setCopied(true)
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Live API Playground</h2>
            <p className="mt-1 text-sm text-slate-500">
              Test the public web gallery endpoints against your local API server.
            </p>
          </div>
          <div className="rounded-md bg-slate-950 px-3 py-2 font-mono text-xs text-white">
            {selectedEndpoint.method} {selectedEndpoint.path}
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[420px_1fr]">
        <div className="space-y-5 border-b border-slate-200 p-5 xl:border-b-0 xl:border-r">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Endpoint</span>
            <select
              className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => {
                setEndpoint(event.target.value)
                setError('')
                setResponse(null)
                setStatus(null)
              }}
              value={endpoint}
            >
              {endpointOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">{selectedEndpoint.description}</p>
          </label>

          {endpoint === 'list' ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Category Filter
              </span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setCategory(event.target.value)}
                placeholder="nature"
                type="text"
                value={category}
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Image ID</span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 font-mono text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setImageId(event.target.value)}
                placeholder="665f4d0a4f2a1c6c5f6c9a20"
                type="text"
                value={imageId}
              />
            </label>
          )}

          <div>
            <span className="text-sm font-medium text-slate-700">Request URL</span>
            <div className="mt-2 flex overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              <div className="min-w-0 flex-1 truncate px-3 py-2 font-mono text-xs text-slate-700">
                {requestUrl}
              </div>
              <button
                aria-label="Copy request URL"
                className="inline-flex h-10 w-10 items-center justify-center border-l border-slate-200 text-slate-600 hover:bg-white"
                onClick={copyRequestUrl}
                type="button"
              >
                <Copy aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            {copied && <p className="mt-2 text-xs text-emerald-700">Copied.</p>}
          </div>

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isLoading}
            onClick={runRequest}
            type="button"
          >
            <Play aria-hidden="true" className="h-4 w-4" />
            {isLoading ? 'Running request...' : 'Run Request'}
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                error
                  ? 'bg-red-50 text-red-700'
                  : status
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {error ? (
                <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {status ? `Status ${status}` : 'Not run yet'}
            </span>
            {duration !== null && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {duration} ms
              </span>
            )}
          </div>

          <CodeBlock title="Live Response">
            {response
              ? JSON.stringify(response, null, 2)
              : `{
  "message": "Run a request to see the live response."
}`}
          </CodeBlock>
        </div>
      </div>
    </section>
  )
}

export default ApiPlayground
