function StatusMessage({ error, message }) {
  if (!error && !message) {
    return null
  }

  return (
    <div
      className={`mt-6 rounded-md border px-4 py-3 text-sm ${
        error
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      {error || message}
    </div>
  )
}

export default StatusMessage
