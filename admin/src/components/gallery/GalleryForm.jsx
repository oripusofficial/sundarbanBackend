import { Check, ImagePlus, UploadCloud } from 'lucide-react'

function GalleryForm({ form, isSubmitting, onChange, onSubmit }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-md bg-emerald-50 p-2 text-emerald-700">
          <ImagePlus aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-950">Upload Image</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add images to ImageKit and publish them to the gallery.
          </p>
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Image</span>
          <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
            {form.imagePreviewUrl ? (
              <img
                alt="Selected upload preview"
                className="mb-3 aspect-[4/3] w-full rounded-md object-cover"
                src={form.imagePreviewUrl}
              />
            ) : (
              <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-md bg-white text-slate-400">
                <UploadCloud aria-hidden="true" className="h-8 w-8" />
              </div>
            )}
            <input
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
              name="image"
              onChange={onChange}
              required
              type="file"
            />
          </div>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              name="title"
              onChange={onChange}
              placeholder="Sunset creek"
              required
              type="text"
              value={form.title}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              name="category"
              onChange={onChange}
              placeholder="nature"
              type="text"
              value={form.category}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Alt Text</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            name="altText"
            onChange={onChange}
            placeholder="Short description for accessibility"
            type="text"
            value={form.altText}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            name="description"
            onChange={onChange}
            placeholder="Optional notes about this image"
            value={form.description}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Sort Order</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              name="sortOrder"
              onChange={onChange}
              type="number"
              value={form.sortOrder}
            />
          </label>

          <label className="flex items-end">
            <span className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">Published</span>
              <input
                checked={form.isActive}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                name="isActive"
                onChange={onChange}
                type="checkbox"
              />
            </span>
          </label>
        </div>

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            'Uploading...'
          ) : (
            <>
              <Check aria-hidden="true" className="h-4 w-4" />
              Upload Image
            </>
          )}
        </button>
      </form>
    </section>
  )
}

export default GalleryForm
