import GalleryImageCard from './GalleryImageCard'

function GalleryGrid({ images, isLoading, onDelete, onToggleActive }) {
  return (
    <section>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white"
              key={index}
            >
              <div className="h-44 bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
                <div className="h-9 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <h2 className="font-semibold text-slate-950">No matching images</h2>
          <p className="mt-2 text-sm text-slate-500">
            Upload a new image or adjust your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {images.map((image) => (
            <GalleryImageCard
              image={image}
              key={image._id}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default GalleryGrid
