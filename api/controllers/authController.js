const jwt = require('jsonwebtoken')

const User = require('../models/User')

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing')
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  )
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select(
      '+password',
    )

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    res.json({
      message: 'Login successful',
      token: createToken(user),
      user: publicUser(user),
    })
  } catch (error) {
    next(error)
  }
}

async function me(req, res) {
  res.json({
    message: 'Authenticated user fetched',
    user: publicUser(req.user),
  })
}

module.exports = {
  login,
  me,
}
