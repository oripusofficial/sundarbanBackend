const express = require('express')

const authController = require('../controllers/authController')
const galleryController = require('../controllers/galleryController')
const authenticate = require('../middleware/auth')
const upload = require('../middleware/upload')

const router = express.Router()

router.post('/auth/login', authController.login)

router.use(authenticate)

router.get('/auth/me', authController.me)

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Admin dashboard API ready',
    data: {
      bookings: 128,
      enquiries: 23,
      activeTours: 16,
    },
  })
})

router.get('/gallery', galleryController.listGallery)
router.get('/gallery/:id', galleryController.getGalleryImage)
router.post('/gallery', upload.single('image'), galleryController.createGalleryImage)
router.patch('/gallery/:id', galleryController.updateGalleryImage)
router.delete('/gallery/:id', galleryController.deleteGalleryImage)

module.exports = router
