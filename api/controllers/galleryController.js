const GalleryImage = require('../models/GalleryImage')
const imagekitService = require('../services/imagekitService')

function parseBoolean(value, fallback) {
  if (value === undefined) return fallback
  return value === true || value === 'true'
}

function parseNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

function buildGalleryQuery({ activeOnly, category }) {
  const query = {}

  if (activeOnly) {
    query.isActive = true
  }

  if (category) {
    query.category = category
  }

  return query
}

async function listGallery(req, res, next) {
  try {
    const activeOnly = req.galleryActiveOnly ?? false
    const images = await GalleryImage.find(
      buildGalleryQuery({ activeOnly, category: req.query.category }),
    ).sort({ sortOrder: 1, createdAt: -1 })

    res.json({
      message: 'Gallery images fetched',
      data: images,
    })
  } catch (error) {
    next(error)
  }
}

async function getGalleryImage(req, res, next) {
  try {
    const query = buildGalleryQuery({
      activeOnly: req.galleryActiveOnly ?? false,
    })
    query._id = req.params.id

    const image = await GalleryImage.findOne(query)

    if (!image) {
      return res.status(404).json({
        message: 'Gallery image not found',
      })
    }

    res.json({
      message: 'Gallery image fetched',
      data: image,
    })
  } catch (error) {
    next(error)
  }
}

async function createGalleryImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Image file is required',
      })
    }

    const title = req.body.title?.trim()

    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
      })
    }

    const uploaded = await imagekitService.uploadImage(req.file, title)

    const image = await GalleryImage.create({
      title,
      altText: req.body.altText || title,
      description: req.body.description || '',
      category: req.body.category || 'general',
      imageKitFileId: uploaded.fileId,
      imageKitFilePath: uploaded.filePath,
      url: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl || uploaded.url,
      width: uploaded.width || null,
      height: uploaded.height || null,
      sortOrder: parseNumber(req.body.sortOrder),
      isActive: parseBoolean(req.body.isActive, true),
    })

    res.status(201).json({
      message: 'Gallery image uploaded',
      data: image,
    })
  } catch (error) {
    next(error)
  }
}

async function updateGalleryImage(req, res, next) {
  try {
    const updates = {}
    const allowedFields = ['title', 'altText', 'description', 'category']

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    if (req.body.sortOrder !== undefined) {
      updates.sortOrder = parseNumber(req.body.sortOrder)
    }

    if (req.body.isActive !== undefined) {
      updates.isActive = parseBoolean(req.body.isActive, true)
    }

    const image = await GalleryImage.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!image) {
      return res.status(404).json({
        message: 'Gallery image not found',
      })
    }

    res.json({
      message: 'Gallery image updated',
      data: image,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteGalleryImage(req, res, next) {
  try {
    const image = await GalleryImage.findById(req.params.id)

    if (!image) {
      return res.status(404).json({
        message: 'Gallery image not found',
      })
    }

    await imagekitService.deleteImage(image.imageKitFileId)
    await image.deleteOne()

    res.json({
      message: 'Gallery image deleted',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryImage,
  listGallery,
  updateGalleryImage,
}
