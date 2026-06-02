const jwt = require('jsonwebtoken')

const User = require('../models/User')

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded.id, isActive: true })

    if (!user) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}

module.exports = authenticate
