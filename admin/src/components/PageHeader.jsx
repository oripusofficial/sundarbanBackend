function PageHeader({ eyebrow, title, action }) {
  return (
    <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h1>
        </div>
        {action}
      </div>
    </header>
  )
}

export default PageHeader
