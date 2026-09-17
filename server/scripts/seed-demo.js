// Seeds a demo account so the app can be tried without a register screen.
// Run: npm run seed [email] [password] [display name]
// Defaults are used when no arguments are given. Re-running with a name
// updates an existing account's display name.
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import config from '../src/config/index.js'
import User from '../src/modules/users/user.model.js'

function nameFromEmail(email) {
  const local = email.split('@')[0]
  const words = local
    .replace(/[._-]+/g, ' ')
    .replace(/[0-9]+/g, '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  return words.join(' ') || 'Nuzio Reader'
}

async function seed() {
  await mongoose.connect(config.mongoUri)
  console.log(`Connected to ${config.mongoUri}`)

  const EMAIL = (process.argv[2] || 'demo@nuzio.ai').toLowerCase()
  const PASSWORD = process.argv[3] || 'demo123'
  const NAME = process.argv[4] || (EMAIL === 'demo@nuzio.ai' ? 'Demo User' : nameFromEmail(EMAIL))

  const exists = await User.findOne({ email: EMAIL })
  if (exists) {
    if (NAME && exists.name !== NAME) {
      exists.name = NAME
      await exists.save()
      console.log(`Updated name for existing user: ${EMAIL} -> "${NAME}"`)
    } else {
      console.log(`User already exists: ${EMAIL} (id ${exists.id})`)
    }
    await mongoose.disconnect()
    return
  }

  await User.create({
    name: NAME,
    email: EMAIL,
    password: await bcrypt.hash(PASSWORD, 10),
    preferences: { language: 'en', profession: '', interests: [] },
    onboardingCompleted: false,
  })

  console.log(`Created user: ${EMAIL} / ${PASSWORD} as "${NAME}"`)
  await mongoose.disconnect()
}

seed().catch(async (err) => {
  console.error('Seed failed:', err)
  await mongoose.disconnect()
  process.exit(1)
})