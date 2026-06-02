const cors = require('cors')
const express = require('express')

const adminRoutes = require('./admin/routes')
const webRoutes = require('./web/routes')

const app = express()

const corsOptions = {
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: false,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  origin: '*',
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'sundarban-api',
  })
})

app.use('/api/web', webRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

app.use((err, req, res, next) => {
  let statusCode = 500

  if (err.name === 'ValidationError') {
    statusCode = 422
  }

  if (err.name === 'CastError' || err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400
  }

  if (err.message === 'Only image files are allowed') {
    statusCode = 400
  }

  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
  })
})

module.exports = app
