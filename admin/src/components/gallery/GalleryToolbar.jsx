import { Filter, Search } from 'lucide-react'

function GalleryToolbar({
  categories,
  categoryFilter,
  resultCount,
  searchTerm,
  sortBy,
  statusFilter,
  totalCount,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onStatusChange,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Filter aria-hidden="true" className="h-4 w-4 text-emerald-700" />
            Gallery Library
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Showing {resultCount} of {totalCount} images
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_150px_170px_150px] xl:w-[780px]">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search title, category, alt text"
              type="search"
              value={searchTerm}
            />
          </label>

          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            onChange={(event) => onStatusChange(event.target.value)}
            value={statusFilter}
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>

          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            onChange={(event) => onCategoryChange(event.target.value)}
            value={categoryFilter}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            onChange={(event) => onSortChange(event.target.value)}
            value={sortBy}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="sortOrder">Sort order</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default GalleryToolbar
