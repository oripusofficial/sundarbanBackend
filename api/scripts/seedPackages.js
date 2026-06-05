require('dotenv').config()

const mongoose = require('mongoose')

const connectDB = require('../config/db')
const TourPackage = require('../models/TourPackage')

const LIVE_BASE_URL = 'https://sundarban-greenland-tourism.vercel.app'
const packageSlugs = [
  '1-day-sundarban-tour',
  '1-night-2-days-sundarban-tour',
  '2-nights-3-days-standard-sundarban-tour',
  '2-nights-3-days-deluxe-sundarban-tour',
  'honeymoon-1-night-2-days',
  'honeymoon-2-nights-3-days',
]

function decodeEscapedJson(value) {
  return value
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

function extractPackagePayload(html) {
  const marker = '\\"pkg\\":'
  const start = html.indexOf(marker)

  if (start < 0) {
    throw new Error('Package payload not found')
  }

  let depth = 0
  let inString = false
  let escape = false
  let end = -1

  for (let index = start + marker.length; index < html.length; index += 1) {
    const char = html[index]

    if (escape) {
      escape = false
      continue
    }

    if (char === '\\') {
      escape = true
      continue
    }

    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) {
      continue
    }

    if (char === '{') {
      depth += 1
    }

    if (char === '}') {
      depth -= 1

      if (depth === 0) {
        end = index + 1
        break
      }
    }
  }

  if (end < 0) {
    throw new Error('Package payload could not be parsed')
  }

  return JSON.parse(decodeEscapedJson(html.slice(start + marker.length, end)))
}

function getPriceUnit(priceLabel) {
  return priceLabel?.toLowerCase().includes('couple') ? 'couple' : 'person'
}

function getCategory(slug) {
  return slug.includes('honeymoon') ? 'honeymoon' : 'tour'
}

function getItinerary(itinerary = []) {
  return itinerary.map((item) => ({
    dayCount: item.dayCount || 1,
    time: item.time || '',
    activity: item.activity || '',
  }))
}

async function fetchPackage(slug, sortOrder) {
  const response = await fetch(`${LIVE_BASE_URL}/packages/${slug}`)

  if (!response.ok) {
    throw new Error(`Unable to fetch ${slug}: ${response.status}`)
  }

  const html = await response.text()
  const pkg = extractPackagePayload(html)

  return {
    title: pkg.title,
    slug: pkg.slug,
    shortTitle: pkg.title,
    description: pkg.description,
    price: pkg.price,
    priceLabel: pkg.priceLabel,
    priceUnit: getPriceUnit(pkg.priceLabel),
    isAllInclusive: true,
    advancePaymentLabel: '',
    duration: pkg.duration,
    groupSize: pkg.groupSize,
    category: getCategory(pkg.slug),
    featured: Boolean(pkg.featured),
    sortOrder,
    isActive: true,
    highlights: pkg.highlights || [],
    itinerary: getItinerary(pkg.itinerary),
    imageKitFileId: '',
    imageKitFilePath: '',
    imageUrl: new URL(pkg.image, LIVE_BASE_URL).toString(),
    thumbnailUrl: new URL(pkg.image, LIVE_BASE_URL).toString(),
    imageAlt: pkg.title,
    metaTitle: `${pkg.title} | Sundarban Greenland Tourism`,
    metaDescription: pkg.description,
  }
}

async function seedPackages() {
  await connectDB()

  const packages = await Promise.all(
    packageSlugs.map((slug, index) => fetchPackage(slug, index + 1)),
  )

  for (const tourPackage of packages) {
    await TourPackage.findOneAndUpdate(
      { slug: tourPackage.slug },
      { $set: tourPackage },
      { returnDocument: 'after', runValidators: true, upsert: true },
    )
    console.log(`Seeded package: ${tourPackage.slug}`)
  }
}

seedPackages()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
