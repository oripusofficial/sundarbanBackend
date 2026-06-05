const TourPackage = require('../models/TourPackage')
const imagekitService = require('../services/imagekitService')

const stringArrayFields = ['highlights']
const publicPackageListFields = [
  'title',
  'slug',
  'shortTitle',
  'description',
  'price',
  'priceLabel',
  'priceUnit',
  'duration',
  'groupSize',
  'category',
  'featured',
  'highlights',
  'imageUrl',
  'thumbnailUrl',
  'imageAlt',
]

function parseBoolean(value, fallback) {
  if (value === undefined) return fallback
  return value === true || value === 'true'
}

function parseNumber(value, fallback = 0) {
  if (value === undefined || value === '') return fallback

  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

function parsePositiveInteger(value, fallback = 1) {
  const parsed = Math.floor(parseNumber(value, fallback))
  return parsed > 0 ? parsed : fallback
}

function parseJsonValue(value, fallback) {
  if (value === undefined) return fallback
  if (Array.isArray(value) || typeof value === 'object') return value

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function normalizeStringArray(value) {
  const parsed = parseJsonValue(value, value)
  const values = Array.isArray(parsed)
    ? parsed
    : String(parsed || '')
        .split('\n')
        .map((item) => item.trim())

  return values.map((item) => String(item || '').trim()).filter(Boolean)
}

function normalizeItinerary(value) {
  const parsed = parseJsonValue(value, [])

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed
    .map((item) => ({
      dayCount: parsePositiveInteger(item?.dayCount, 1),
      time: String(item?.time || '').trim(),
      activity: String(item?.activity || '').trim(),
    }))
    .filter((item) => item.time || item.activity)
}

function getPackageImageFolder() {
  return process.env.IMAGEKIT_PACKAGE_FOLDER || '/sundarban/packages'
}

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildPackageQuery({ activeOnly, category, featured }) {
  const query = {}

  if (activeOnly) {
    query.isActive = true
  }

  if (category) {
    query.category = category
  }

  if (featured !== undefined) {
    query.featured = parseBoolean(featured, false)
  }

  return query
}

function buildPackagePayload(body, { isCreate = false } = {}) {
  const updates = {}
  const textFields = [
    'title',
    'shortTitle',
    'description',
    'priceLabel',
    'priceUnit',
    'advancePaymentLabel',
    'duration',
    'groupSize',
    'category',
    'imageAlt',
    'metaTitle',
    'metaDescription',
  ]

  textFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = String(body[field] || '').trim()
    }
  })

  if (body.slug !== undefined) {
    updates.slug = normalizeSlug(body.slug)
  } else if (isCreate && body.title) {
    updates.slug = normalizeSlug(body.title)
  }

  if (body.price !== undefined) {
    updates.price = parseNumber(body.price)
  }

  if (body.sortOrder !== undefined) {
    updates.sortOrder = parseNumber(body.sortOrder)
  }

  if (body.isAllInclusive !== undefined) {
    updates.isAllInclusive = parseBoolean(body.isAllInclusive, true)
  }

  if (body.featured !== undefined) {
    updates.featured = parseBoolean(body.featured, false)
  }

  if (body.isActive !== undefined) {
    updates.isActive = parseBoolean(body.isActive, true)
  }

  stringArrayFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = normalizeStringArray(body[field])
    }
  })

  if (body.itinerary !== undefined) {
    updates.itinerary = normalizeItinerary(body.itinerary)
  }

  return updates
}

async function listPackages(req, res, next) {
  try {
    const activeOnly = req.packagesActiveOnly ?? false
    const query = TourPackage.find(
      buildPackageQuery({
        activeOnly,
        category: req.query.category,
        featured: req.query.featured,
      }),
    )

    if (activeOnly) {
      query.select(publicPackageListFields.join(' '))
    }

    const packages = await query.sort({ sortOrder: 1, createdAt: -1 })

    res.json({
      message: 'Tour packages fetched',
      data: packages,
    })
  } catch (error) {
    next(error)
  }
}

async function getPackage(req, res, next) {
  try {
    const query = buildPackageQuery({
      activeOnly: req.packagesActiveOnly ?? false,
    })

    if (req.packagesLookupBySlug) {
      query.slug = req.params.slug
    } else {
      query._id = req.params.id
    }

    const tourPackage = await TourPackage.findOne(query)

    if (!tourPackage) {
      return res.status(404).json({
        message: 'Tour package not found',
      })
    }

    res.json({
      message: 'Tour package fetched',
      data: tourPackage,
    })
  } catch (error) {
    next(error)
  }
}

async function createPackage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Package image is required',
      })
    }

    const title = req.body.title?.trim()

    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
      })
    }

    const uploaded = await imagekitService.uploadImage(
      req.file,
      title,
      getPackageImageFolder(),
    )

    const payload = buildPackagePayload(req.body, { isCreate: true })
    const tourPackage = await TourPackage.create({
      ...payload,
      imageKitFileId: uploaded.fileId,
      imageKitFilePath: uploaded.filePath,
      imageUrl: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl || uploaded.url,
      imageAlt: payload.imageAlt || title,
    })

    res.status(201).json({
      message: 'Tour package created',
      data: tourPackage,
    })
  } catch (error) {
    next(error)
  }
}

async function updatePackage(req, res, next) {
  try {
    const tourPackage = await TourPackage.findById(req.params.id)

    if (!tourPackage) {
      return res.status(404).json({
        message: 'Tour package not found',
      })
    }

    const updates = buildPackagePayload(req.body)
    let previousImageKitFileId = ''

    if (req.file) {
      const uploaded = await imagekitService.uploadImage(
        req.file,
        updates.title || tourPackage.title,
        getPackageImageFolder(),
      )

      previousImageKitFileId = tourPackage.imageKitFileId
      updates.imageKitFileId = uploaded.fileId
      updates.imageKitFilePath = uploaded.filePath
      updates.imageUrl = uploaded.url
      updates.thumbnailUrl = uploaded.thumbnailUrl || uploaded.url
    }

    Object.assign(tourPackage, updates)
    const updatedPackage = await tourPackage.save()

    if (previousImageKitFileId) {
      await imagekitService.deleteImage(previousImageKitFileId)
    }

    res.json({
      message: 'Tour package updated',
      data: updatedPackage,
    })
  } catch (error) {
    next(error)
  }
}

async function deletePackage(req, res, next) {
  try {
    const tourPackage = await TourPackage.findById(req.params.id)

    if (!tourPackage) {
      return res.status(404).json({
        message: 'Tour package not found',
      })
    }

    if (tourPackage.imageKitFileId) {
      await imagekitService.deleteImage(tourPackage.imageKitFileId)
    }

    await tourPackage.deleteOne()

    res.json({
      message: 'Tour package deleted',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPackage,
  deletePackage,
  getPackage,
  listPackages,
  updatePackage,
}
