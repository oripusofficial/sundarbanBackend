const express = require('express')

const galleryController = require('../controllers/galleryController')
const packageController = require('../controllers/packageController')

const router = express.Router()

router.get('/home', (req, res) => {
  res.json({
    message: 'Web API ready',
    data: {
      destination: 'Sundarban',
      featuredPackages: [],
    },
  })
})

router.use('/gallery', (req, res, next) => {
  req.galleryActiveOnly = true
  next()
})

router.get('/gallery', galleryController.listGallery)
router.get('/gallery/:id', galleryController.getGalleryImage)

router.use('/packages', (req, res, next) => {
  req.packagesActiveOnly = true
  next()
})

router.get('/packages', packageController.listPackages)
router.get('/packages/:slug', (req, res, next) => {
  req.packagesLookupBySlug = true
  next()
}, packageController.getPackage)

module.exports = router
