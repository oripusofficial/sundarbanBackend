function CodeBlock({ children, title }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
      {title && (
        <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
