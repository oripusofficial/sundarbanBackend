require('dotenv').config()

const connectDB = require('../config/db')
const User = require('../models/User')

async function seedAdminUser() {
  await connectDB()

  const name = process.env.ADMIN_NAME || 'Sundarban Admin'
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required')
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })

  if (existingUser) {
    existingUser.name = name
    existingUser.password = password
    existingUser.isActive = true
    await existingUser.save()
    console.log('Admin user updated')
    return
  }

  await User.create({
    name,
    email,
    password,
  })

  console.log('Admin user created')
}

seedAdminUser()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    const mongoose = require('mongoose')
    await mongoose.disconnect()
  })
