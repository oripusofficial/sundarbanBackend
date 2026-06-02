const express = require('express')

const galleryController = require('../controllers/galleryController')

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

module.exports = router
