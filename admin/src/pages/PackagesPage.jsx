import {
  Check,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Package,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tags,
  Trash2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusMessage from '../components/StatusMessage'
import { API_BASE_URL } from '../config/api'
import useAuth from '../hooks/useAuth'

const emptyForm = {
  title: '',
  slug: '',
  shortTitle: '',
  description: '',
  price: '',
  priceLabel: '',
  priceUnit: 'person',
  isAllInclusive: true,
  advancePaymentLabel: '',
  duration: '',
  groupSize: '',
  category: 'tour',
  featured: false,
  sortOrder: 0,
  isActive: true,
  highlights: [''],
  itinerary: [{ dayCount: 1, time: '', activity: '' }],
  imageAlt: '',
  metaTitle: '',
  metaDescription: '',
  image: null,
  imagePreviewUrl: '',
}

const textListConfigs = [
  ['highlights', 'Highlights', 'Sajnekhali Watchtower'],
]

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ensureTextList(value) {
  return value?.length ? value : ['']
}

function ensureObjectList(value, fallback) {
  return value?.length ? value : [fallback]
}

function packageToForm(tourPackage) {
  return {
    ...emptyForm,
    title: tourPackage.title || '',
    slug: tourPackage.slug || '',
    shortTitle: tourPackage.shortTitle || '',
    description: tourPackage.description || '',
    price: tourPackage.price ?? '',
    priceLabel: tourPackage.priceLabel || '',
    priceUnit: tourPackage.priceUnit || 'person',
    isAllInclusive: Boolean(tourPackage.isAllInclusive),
    advancePaymentLabel: tourPackage.advancePaymentLabel || '',
    duration: tourPackage.duration || '',
    groupSize: tourPackage.groupSize || '',
    category: tourPackage.category || 'tour',
    featured: Boolean(tourPackage.featured),
    sortOrder: tourPackage.sortOrder ?? 0,
    isActive: Boolean(tourPackage.isActive),
    highlights: ensureTextList(tourPackage.highlights),
    itinerary: ensureObjectList(tourPackage.itinerary, {
      dayCount: 1,
      time: '',
      activity: '',
    }).map((item) => ({
      dayCount: item.dayCount ?? 1,
      time: item.time || '',
      activity: item.activity || '',
    })),
    imageAlt: tourPackage.imageAlt || '',
    metaTitle: tourPackage.metaTitle || '',
    metaDescription: tourPackage.metaDescription || '',
    image: null,
    imagePreviewUrl: tourPackage.thumbnailUrl || tourPackage.imageUrl || '',
  }
}

function appendFormDataValue(body, key, value) {
  if (Array.isArray(value)) {
    body.append(key, JSON.stringify(value))
    return
  }

  body.append(key, value)
}

function PackagesPage() {
  const { authFetch } = useAuth()
  const [packages, setPackages] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingPackageId, setEditingPackageId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('sortOrder')

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(packages.map((item) => item.category).filter(Boolean))).sort(
        (first, second) => first.localeCompare(second),
      ),
    [packages],
  )

  const stats = useMemo(
    () => [
      {
        change: 'Total',
        icon: Package,
        label: 'Packages',
        tone: 'emerald',
        value: packages.length,
      },
      {
        change: 'Visible',
        icon: Eye,
        label: 'Published',
        tone: 'cyan',
        value: packages.filter((item) => item.isActive).length,
      },
      {
        change: 'Promoted',
        icon: Sparkles,
        label: 'Featured',
        tone: 'amber',
        value: packages.filter((item) => item.featured).length,
      },
      {
        change: 'Groups',
        icon: Tags,
        label: 'Categories',
        tone: 'slate',
        value: categoryOptions.length,
      },
    ],
    [categoryOptions.length, packages],
  )

  const filteredPackages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return packages
      .filter((tourPackage) => {
        const matchesSearch =
          !normalizedSearch ||
          [
            tourPackage.title,
            tourPackage.slug,
            tourPackage.description,
            tourPackage.duration,
            tourPackage.priceLabel,
            tourPackage.category,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch))

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && tourPackage.isActive) ||
          (statusFilter === 'hidden' && !tourPackage.isActive) ||
          (statusFilter === 'featured' && tourPackage.featured)

        const matchesCategory =
          categoryFilter === 'all' || tourPackage.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
      })
      .sort((first, second) => {
        if (sortBy === 'newest') {
          return new Date(second.createdAt) - new Date(first.createdAt)
        }

        if (sortBy === 'title') {
          return first.title.localeCompare(second.title)
        }

        if (sortBy === 'price') {
          return (first.price ?? 0) - (second.price ?? 0)
        }

        return (first.sortOrder ?? 0) - (second.sortOrder ?? 0)
      })
  }, [categoryFilter, packages, searchTerm, sortBy, statusFilter])

  const fetchPackages = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setIsLoading(true)
    }

    setError('')

    try {
      const response = await authFetch(`${API_BASE_URL}/packages`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to fetch packages')
      }

      setPackages(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }, [authFetch])

  useEffect(() => {
    let isMounted = true

    async function loadInitialPackages() {
      try {
        const response = await authFetch(`${API_BASE_URL}/packages`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Unable to fetch packages')
        }

        if (isMounted) {
          setPackages(result.data || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialPackages()

    return () => {
      isMounted = false
    }
  }, [authFetch])

  useEffect(
    () => () => {
      if (form.imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(form.imagePreviewUrl)
      }
    },
    [form.imagePreviewUrl],
  )

  function resetForm() {
    setEditingPackageId('')
    setForm(emptyForm)
  }

  function updateField(event) {
    const { name, type, checked, files, value } = event.target

    setForm((current) => {
      const nextValue =
        type === 'file' ? files?.[0] || null : type === 'checkbox' ? checked : value
      const shouldGenerateSlug = name === 'title' && !editingPackageId && !current.slug

      return {
        ...current,
        [name]: nextValue,
        ...(shouldGenerateSlug ? { slug: slugify(value) } : {}),
        ...(type === 'file'
          ? { imagePreviewUrl: files?.[0] ? URL.createObjectURL(files[0]) : '' }
          : {}),
      }
    })
  }

  function updateTextList(field, index, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }))
  }

  function addTextListItem(field) {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ''],
    }))
  }

  function removeTextListItem(field, index) {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function updateObjectList(field, index, key, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  function addObjectListItem(field, value) {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], value],
    }))
  }

  function removeObjectListItem(field, index) {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function createFormData() {
    const body = new FormData()
    const cleanedForm = {
      ...form,
      highlights: form.highlights.map((item) => item.trim()).filter(Boolean),
      itinerary: form.itinerary
        .map((item) => ({
          dayCount: Math.max(1, Math.floor(Number(item.dayCount) || 1)),
          time: item.time.trim(),
          activity: item.activity.trim(),
        }))
        .filter((item) => item.time || item.activity),
    }

    Object.entries(cleanedForm).forEach(([key, value]) => {
      if (key === 'imagePreviewUrl') {
        return
      }

      if (key === 'image') {
        if (value) {
          body.append('image', value)
        }
        return
      }

      appendFormDataValue(body, key, value)
    })

    return body
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      if (!editingPackageId && !form.image) {
        throw new Error('Please select a package image')
      }

      const response = await authFetch(
        editingPackageId
          ? `${API_BASE_URL}/packages/${editingPackageId}`
          : `${API_BASE_URL}/packages`,
        {
          method: editingPackageId ? 'PATCH' : 'POST',
          body: createFormData(),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to save package')
      }

      setMessage(editingPackageId ? 'Package updated successfully' : 'Package created successfully')
      resetForm()
      await fetchPackages({ showLoading: false })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function editPackage(tourPackage) {
    setMessage('')
    setError('')
    setEditingPackageId(tourPackage._id)
    setForm(packageToForm(tourPackage))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function patchPackage(tourPackage, updates) {
    setMessage('')
    setError('')

    try {
      const response = await authFetch(`${API_BASE_URL}/packages/${tourPackage._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to update package')
      }

      setPackages((items) =>
        items.map((item) => (item._id === tourPackage._id ? result.data : item)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function deletePackage(tourPackage) {
    const shouldDelete = window.confirm(`Delete "${tourPackage.title}"?`)

    if (!shouldDelete) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await authFetch(`${API_BASE_URL}/packages/${tourPackage._id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to delete package')
      }

      setPackages((items) => items.filter((item) => item._id !== tourPackage._id))
      setMessage('Package deleted successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  function renderTextList(field, label, placeholder) {
    return (
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-950">{label}</h3>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            onClick={() => addTextListItem(field)}
            type="button"
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {form[field].map((item, index) => (
            <div className="flex gap-2" key={`${field}-${index}`}>
              <input
                className="h-10 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => updateTextList(field, index, event.target.value)}
                placeholder={placeholder}
                type="text"
                value={item}
              />
              <button
                aria-label={`Remove ${label} item`}
                className="grid h-10 w-10 place-items-center rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => removeTextListItem(field, index)}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderItinerary() {
    return (
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-950">Itinerary</h3>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            onClick={() =>
              addObjectListItem('itinerary', { dayCount: 1, time: '', activity: '' })
            }
            type="button"
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {form.itinerary.map((item, index) => (
            <div
              className="grid gap-2 sm:grid-cols-[120px_160px_1fr_40px]"
              key={`itinerary-${index}`}
            >
              <input
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                min="1"
                onChange={(event) =>
                  updateObjectList('itinerary', index, 'dayCount', event.target.value)
                }
                placeholder="Day 1"
                step="1"
                type="number"
                value={item.dayCount}
              />
              <input
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) =>
                  updateObjectList('itinerary', index, 'time', event.target.value)
                }
                placeholder="5:00 AM"
                type="text"
                value={item.time}
              />
              <input
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) =>
                  updateObjectList('itinerary', index, 'activity', event.target.value)
                }
                placeholder="Departure from Kolkata"
                type="text"
                value={item.activity}
              />
              <button
                aria-label="Remove itinerary item"
                className="grid h-10 w-10 place-items-center rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => removeObjectListItem('itinerary', index)}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <PageHeader
        action={
          <button
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={fetchPackages}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Refresh
          </button>
        }
        eyebrow="Admin Dashboard"
        title="Tour Packages"
      />

      <section className="space-y-6 px-5 py-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard {...stat} key={stat.label} />
          ))}
        </div>

        <StatusMessage error={error} message={message} />

        <form
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="rounded-md bg-emerald-50 p-2 text-emerald-700">
                <ImagePlus aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-950">
                  {editingPackageId ? 'Edit Package' : 'Create Package'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage public tour package content, pricing, and cover image.
                </p>
              </div>
            </div>
            {editingPackageId && (
              <button
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={resetForm}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-[320px_1fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Cover Image</span>
                <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
                  {form.imagePreviewUrl ? (
                    <img
                      alt="Selected package preview"
                      className="mb-3 aspect-[4/3] w-full rounded-md object-cover"
                      src={form.imagePreviewUrl}
                    />
                  ) : (
                    <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-md bg-white text-slate-400">
                      <ImagePlus aria-hidden="true" className="h-8 w-8" />
                    </div>
                  )}
                  <input
                    accept="image/*"
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
                    name="image"
                    onChange={updateField}
                    type="file"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                <span className="text-sm font-medium text-slate-700">Published</span>
                <input
                  checked={form.isActive}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  name="isActive"
                  onChange={updateField}
                  type="checkbox"
                />
              </label>

              <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                <span className="text-sm font-medium text-slate-700">Featured</span>
                <input
                  checked={form.featured}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  name="featured"
                  onChange={updateField}
                  type="checkbox"
                />
              </label>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['title', 'Title', '1 Day Sundarban Explorer', 'text'],
                  ['slug', 'Slug', '1-day-sundarban-tour', 'text'],
                  ['shortTitle', 'Short Title', '1 Day Tour', 'text'],
                  ['duration', 'Duration', '1 Day', 'text'],
                  ['price', 'Price', '1999', 'number'],
                  ['priceLabel', 'Price Label', '₹1,999 / person', 'text'],
                  ['priceUnit', 'Price Unit', 'person', 'text'],
                  ['groupSize', 'Group Size', 'Min 10 persons', 'text'],
                  ['category', 'Category', 'tour', 'text'],
                  ['sortOrder', 'Sort Order', '1', 'number'],
                  ['advancePaymentLabel', 'Advance Payment Label', '50% advance', 'text'],
                  ['imageAlt', 'Image Alt', 'Sundarban tour package', 'text'],
                ].map(([name, label, placeholder, type]) => (
                  <label className="block" key={name}>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <input
                      className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      name={name}
                      onChange={updateField}
                      placeholder={placeholder}
                      required={['title', 'slug', 'duration', 'price', 'priceLabel'].includes(
                        name,
                      )}
                      type={type}
                      value={form[name]}
                    />
                  </label>
                ))}
              </div>

              <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                <span className="text-sm font-medium text-slate-700">All Inclusive</span>
                <input
                  checked={form.isAllInclusive}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  name="isAllInclusive"
                  onChange={updateField}
                  type="checkbox"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Description</span>
                <textarea
                  className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  name="description"
                  onChange={updateField}
                  required
                  value={form.description}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Meta Title</span>
                  <input
                    className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    name="metaTitle"
                    onChange={updateField}
                    type="text"
                    value={form.metaTitle}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Meta Description</span>
                  <input
                    className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    name="metaDescription"
                    onChange={updateField}
                    type="text"
                    value={form.metaDescription}
                  />
                </label>
              </div>

              {textListConfigs.map(([field, label, placeholder]) =>
                renderTextList(field, label, placeholder),
              )}
              {renderItinerary()}

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <Check aria-hidden="true" className="h-4 w-4" />
                    {editingPackageId ? 'Update Package' : 'Create Package'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Package aria-hidden="true" className="h-4 w-4 text-emerald-700" />
                Package Library
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredPackages.length} of {packages.length} packages
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
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, slug, price"
                  type="search"
                  value={searchTerm}
                />
              </label>

              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                <option value="all">All status</option>
                <option value="active">Published</option>
                <option value="hidden">Hidden</option>
                <option value="featured">Featured</option>
              </select>

              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setCategoryFilter(event.target.value)}
                value={categoryFilter}
              >
                <option value="all">All categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setSortBy(event.target.value)}
                value={sortBy}
              >
                <option value="sortOrder">Sort order</option>
                <option value="newest">Newest</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white"
                key={index}
              />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <h2 className="font-semibold text-slate-950">No matching packages</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create a package or adjust filters to see more results.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPackages.map((tourPackage) => (
              <article
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                key={tourPackage._id}
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  {tourPackage.thumbnailUrl || tourPackage.imageUrl ? (
                    <img
                      alt={tourPackage.imageAlt || tourPackage.title}
                      className="h-full w-full object-cover"
                      src={tourPackage.thumbnailUrl || tourPackage.imageUrl}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-slate-400">
                      <Package aria-hidden="true" className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold shadow-sm ${
                        tourPackage.isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900/80 text-white'
                      }`}
                    >
                      {tourPackage.isActive ? 'Published' : 'Hidden'}
                    </span>
                    {tourPackage.featured && (
                      <span className="rounded-full bg-amber-400 px-2 py-1 text-xs font-semibold text-slate-950 shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{tourPackage.title}</h3>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500">
                      /packages/{tourPackage.slug}
                    </p>
                  </div>

                  <p className="line-clamp-2 text-sm text-slate-600">
                    {tourPackage.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-slate-50 p-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                        Duration
                      </div>
                      <div className="mt-1 font-semibold text-slate-950">
                        {tourPackage.duration}
                      </div>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Price</div>
                      <div className="mt-1 font-semibold text-slate-950">
                        {tourPackage.priceLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => editPackage(tourPackage)}
                      type="button"
                    >
                      <Edit3 aria-hidden="true" className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      aria-label={tourPackage.isActive ? 'Hide package' : 'Publish package'}
                      className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                      onClick={() =>
                        patchPackage(tourPackage, { isActive: !tourPackage.isActive })
                      }
                      type="button"
                    >
                      {tourPackage.isActive ? (
                        <EyeOff aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <Eye aria-hidden="true" className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      aria-label={tourPackage.featured ? 'Unfeature package' : 'Feature package'}
                      className="grid h-10 w-10 place-items-center rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100"
                      onClick={() =>
                        patchPackage(tourPackage, { featured: !tourPackage.featured })
                      }
                      type="button"
                    >
                      <Sparkles aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={`Delete ${tourPackage.title}`}
                      className="grid h-10 w-10 place-items-center rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                      onClick={() => deletePackage(tourPackage)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default PackagesPage
