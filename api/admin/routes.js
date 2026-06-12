const express = require('express')

const authController = require('../controllers/authController')
const galleryController = require('../controllers/galleryController')
const invoiceController = require('../controllers/invoiceController')
const packageController = require('../controllers/packageController')
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

router.get('/invoices', invoiceController.listInvoices)
router.get('/invoices/next-number', invoiceController.getNextInvoiceNumber)
router.get('/invoices/:id', invoiceController.getInvoice)
router.post('/invoices', invoiceController.createInvoice)
router.patch('/invoices/:id', invoiceController.updateInvoice)
router.delete('/invoices/:id', invoiceController.deleteInvoice)

router.get('/packages', packageController.listPackages)
router.get('/packages/:id', packageController.getPackage)
router.post('/packages', upload.single('image'), packageController.createPackage)
router.patch('/packages/:id', upload.single('image'), packageController.updatePackage)
router.delete('/packages/:id', packageController.deletePackage)

module.exports = router
