function StatCard({ change, icon: Icon, label, tone = 'emerald', value }) {
  const toneClasses = {
    amber: 'bg-amber-50 text-amber-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    slate: 'bg-slate-100 text-slate-700',
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && (
          <span className={`rounded-md p-2 ${toneClasses[tone]}`}>
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <strong className="text-3xl font-semibold tracking-tight text-slate-950">
          {value}
        </strong>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}>
          {change}
        </span>
      </div>
    </article>
  )
}

export default StatCard
