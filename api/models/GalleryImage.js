const mongoose = require('mongoose')

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'general',
    },
    imageKitFileId: {
      type: String,
      required: true,
    },
    imageKitFilePath: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

galleryImageSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 })
galleryImageSchema.index({ category: 1 })

module.exports = mongoose.model('GalleryImage', galleryImageSchema)
