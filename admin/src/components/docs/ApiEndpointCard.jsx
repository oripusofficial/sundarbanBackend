function ApiEndpointCard({ children, description, method = 'GET', path, title }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 font-mono text-xs text-white">
            <span className="text-emerald-300">{method}</span>
            <span>{path}</span>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </article>
  )
}

export default ApiEndpointCard
