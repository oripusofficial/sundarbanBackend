import { Eye, EyeOff, Trash2, Pencil } from 'lucide-react'

function GalleryImageCard({ image, onDelete, onEdit, onToggleActive }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          alt={image.altText || image.title}
          className="h-full w-full object-cover"
          src={image.thumbnailUrl || image.url}
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold shadow-sm ${
              image.isActive
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 text-white'
            }`}
          >
            {image.isActive ? 'Published' : 'Hidden'}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="truncate font-semibold text-slate-950">{image.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-cyan-50 px-2 py-1 font-medium text-cyan-700">
              {image.category}
            </span>
            <span>Order {image.sortOrder ?? 0}</span>
          </div>
        </div>

        {image.description && (
          <p className="line-clamp-2 text-sm text-slate-600">{image.description}</p>
        )}

        <div className="flex gap-2">
          <button
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => onEdit(image)}
            type="button"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Edit
          </button>
          <button
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => onToggleActive(image)}
            type="button"
          >
            {image.isActive ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
            {image.isActive ? 'Hide' : 'Show'}
          </button>
          <button
            aria-label={`Delete ${image.title}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700 hover:bg-red-100"
            onClick={() => onDelete(image)}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default GalleryImageCard
