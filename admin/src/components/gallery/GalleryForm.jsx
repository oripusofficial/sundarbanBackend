import { Check, ImagePlus, UploadCloud, X } from 'lucide-react'

function GalleryForm({ form, isSubmitting, onChange, onCancel, onSubmit }) {
  const isEditing = !!form._id

  return (
    <section className={`rounded-lg border p-5 shadow-sm bg-white ${isEditing ? 'border-cyan-200 ring-1 ring-cyan-100' : 'border-slate-200'}`}>
      <div className="flex items-start gap-3">
        <span className={`rounded-md p-2 ${isEditing ? 'bg-cyan-50 text-cyan-700' : 'bg-emerald-50 text-emerald-700'}`}>
          <ImagePlus aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-950">
            {isEditing ? 'Edit Image Details' : 'Upload Image'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? 'Update the metadata for this gallery item.'
              : 'Add images to ImageKit and publish them to the gallery.'}
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
            {!isEditing ? (
              <input
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
                name="image"
                onChange={onChange}
                required
                type="file"
              />
            ) : (
              <p className="text-xs text-slate-500 text-center">
                Image source file cannot be replaced during metadata editing.
              </p>
            )}
          </div>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              className={`mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                isEditing
                  ? 'border-slate-200 focus:border-cyan-600 focus:ring-cyan-100'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
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
              className={`mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                isEditing
                  ? 'border-slate-200 focus:border-cyan-600 focus:ring-cyan-100'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
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
            className={`mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
              isEditing
                ? 'border-slate-200 focus:border-cyan-600 focus:ring-cyan-100'
                : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
            }`}
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
            className={`mt-2 min-h-24 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
              isEditing
                ? 'border-slate-200 focus:border-cyan-600 focus:ring-cyan-100'
                : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
            }`}
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
              className={`mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                isEditing
                  ? 'border-slate-200 focus:border-cyan-600 focus:ring-cyan-100'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
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
                className={`h-4 w-4 rounded border-slate-300 focus:ring-2 ${
                  isEditing
                    ? 'text-cyan-700 focus:ring-cyan-600'
                    : 'text-emerald-700 focus:ring-emerald-600'
                }`}
                name="isActive"
                onChange={onChange}
                type="checkbox"
              />
            </span>
          </label>
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <button
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed ${
              isEditing
                ? 'flex-1 bg-cyan-700 hover:bg-cyan-800 disabled:bg-slate-400'
                : 'w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400'
            }`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              isEditing ? 'Saving...' : 'Uploading...'
            ) : (
              <>
                <Check aria-hidden="true" className="h-4 w-4" />
                {isEditing ? 'Save Changes' : 'Upload Image'}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}

export default GalleryForm
