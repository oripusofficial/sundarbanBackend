const mongoose = require('mongoose')

const itineraryItemSchema = new mongoose.Schema(
  {
    dayCount: {
      type: Number,
      min: 1,
      default: 1,
    },
    time: {
      type: String,
      trim: true,
      default: '',
    },
    activity: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false },
)

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL friendly'],
    },
    shortTitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceLabel: {
      type: String,
      required: true,
      trim: true,
    },
    priceUnit: {
      type: String,
      trim: true,
      default: 'person',
    },
    isAllInclusive: {
      type: Boolean,
      default: true,
    },
    advancePaymentLabel: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    groupSize: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'tour',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryItemSchema],
      default: [],
    },
    imageKitFileId: {
      type: String,
      default: '',
    },
    imageKitFilePath: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageAlt: {
      type: String,
      trim: true,
      default: '',
    },
    metaTitle: {
      type: String,
      trim: true,
      default: '',
    },
    metaDescription: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

tourPackageSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 })
tourPackageSchema.index({ category: 1 })
tourPackageSchema.index({ featured: 1 })

module.exports = mongoose.model('TourPackage', tourPackageSchema)
