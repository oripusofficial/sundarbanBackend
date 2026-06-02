import { useEffect, useMemo, useState } from 'react'
import { Cloud, Eye, Images, RefreshCw, Tags } from 'lucide-react'

import GalleryForm from '../components/gallery/GalleryForm'
import GalleryGrid from '../components/gallery/GalleryGrid'
import GalleryToolbar from '../components/gallery/GalleryToolbar'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusMessage from '../components/StatusMessage'
import { API_BASE_URL } from '../config/api'
import useAuth from '../hooks/useAuth'

const emptyForm = {
  title: '',
  altText: '',
  description: '',
  category: 'general',
  sortOrder: 0,
  isActive: true,
  image: null,
  imagePreviewUrl: '',
}

function GalleryPage() {
  const { authFetch } = useAuth()
  const [galleryImages, setGalleryImages] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const activeCount = useMemo(
    () => galleryImages.filter((image) => image.isActive).length,
    [galleryImages],
  )

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(galleryImages.map((image) => image.category).filter(Boolean)),
      ).sort((first, second) => first.localeCompare(second)),
    [galleryImages],
  )

  const filteredImages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return galleryImages
      .filter((image) => {
        const matchesSearch =
          !normalizedSearch ||
          [image.title, image.category, image.altText, image.description]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch))

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && image.isActive) ||
          (statusFilter === 'hidden' && !image.isActive)

        const matchesCategory =
          categoryFilter === 'all' || image.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
      })
      .sort((first, second) => {
        if (sortBy === 'oldest') {
          return new Date(first.createdAt) - new Date(second.createdAt)
        }

        if (sortBy === 'sortOrder') {
          return (first.sortOrder ?? 0) - (second.sortOrder ?? 0)
        }

        if (sortBy === 'title') {
          return first.title.localeCompare(second.title)
        }

        return new Date(second.createdAt) - new Date(first.createdAt)
      })
  }, [categoryFilter, galleryImages, searchTerm, sortBy, statusFilter])

  const stats = [
    {
      change: 'Total',
      icon: Images,
      label: 'Gallery Images',
      tone: 'emerald',
      value: galleryImages.length,
    },
    {
      change: 'Visible',
      icon: Eye,
      label: 'Active Images',
      tone: 'cyan',
      value: activeCount,
    },
    {
      change: 'Groups',
      icon: Tags,
      label: 'Categories',
      tone: 'amber',
      value: categoryOptions.length,
    },
    {
      change: 'Ready',
      icon: Cloud,
      label: 'Storage',
      tone: 'slate',
      value: 'ImageKit',
    },
  ]

  async function fetchGallery({ showLoading = true } = {}) {
    if (showLoading) {
      setIsLoading(true)
    }

    setError('')

    try {
      const response = await authFetch(`${API_BASE_URL}/gallery`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to fetch gallery')
      }

      setGalleryImages(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadInitialGallery() {
      try {
        const response = await authFetch(`${API_BASE_URL}/gallery`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Unable to fetch gallery')
        }

        if (isMounted) {
          setGalleryImages(result.data || [])
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

    loadInitialGallery()

    return () => {
      isMounted = false
    }
  }, [authFetch])

  useEffect(
    () => () => {
      if (form.imagePreviewUrl) {
        URL.revokeObjectURL(form.imagePreviewUrl)
      }
    },
    [form.imagePreviewUrl],
  )

  function updateField(event) {
    const { name, type, checked, files, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'file' ? files?.[0] || null : type === 'checkbox' ? checked : value,
      ...(type === 'file'
        ? { imagePreviewUrl: files?.[0] ? URL.createObjectURL(files[0]) : '' }
        : {}),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      if (!form.image) {
        throw new Error('Please select an image')
      }

      const body = new FormData()
      body.append('image', form.image)
      body.append('title', form.title)
      body.append('altText', form.altText)
      body.append('description', form.description)
      body.append('category', form.category)
      body.append('sortOrder', form.sortOrder)
      body.append('isActive', form.isActive)

      const response = await authFetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        body,
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to upload image')
      }

      setForm(emptyForm)
      event.target.reset()
      setMessage('Image uploaded successfully')
      await fetchGallery({ showLoading: false })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleActive(image) {
    setMessage('')
    setError('')

    try {
      const response = await authFetch(`${API_BASE_URL}/gallery/${image._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !image.isActive,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to update image')
      }

      setGalleryImages((images) =>
        images.map((item) => (item._id === image._id ? result.data : item)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteImage(image) {
    const shouldDelete = window.confirm(`Delete "${image.title}" from the gallery?`)

    if (!shouldDelete) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await authFetch(`${API_BASE_URL}/gallery/${image._id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to delete image')
      }

      setGalleryImages((images) => images.filter((item) => item._id !== image._id))
      setMessage('Image deleted successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <PageHeader
        action={
          <button
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={fetchGallery}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Refresh
          </button>
        }
        eyebrow="Admin Dashboard"
        title="Image Gallery"
      />

      <section className="px-5 py-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard {...stat} key={stat.label} />
          ))}
        </div>

        <StatusMessage error={error} message={message} />

        <div className="mt-6 grid gap-6 xl:grid-cols-[400px_1fr]">
          <GalleryForm
            form={form}
            isSubmitting={isSubmitting}
            onChange={updateField}
            onSubmit={handleSubmit}
          />

          <div className="space-y-4">
            <GalleryToolbar
              categories={categoryOptions}
              categoryFilter={categoryFilter}
              resultCount={filteredImages.length}
              searchTerm={searchTerm}
              sortBy={sortBy}
              statusFilter={statusFilter}
              totalCount={galleryImages.length}
              onCategoryChange={setCategoryFilter}
              onSearchChange={setSearchTerm}
              onSortChange={setSortBy}
              onStatusChange={setStatusFilter}
            />
            <GalleryGrid
              images={filteredImages}
              isLoading={isLoading}
              onDelete={deleteImage}
              onToggleActive={toggleActive}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default GalleryPage
