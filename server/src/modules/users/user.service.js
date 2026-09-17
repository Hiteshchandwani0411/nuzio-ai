import User from './user.model.js'
import { ApiError } from '../../utils/ApiError.js'

export async function getUserById(userId) {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  return user.toSafeObject()
}

export async function getPreferences(userId) {
  const user = await User.findById(userId).select('preferences onboardingCompleted')
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  return {
    preferences: user.preferences || { language: null, profession: null, interests: [] },
    onboardingCompleted: user.onboardingCompleted,
  }
}

export async function updatePreferences(userId, prefs) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        preferences: {
          language: prefs.language || null,
          profession: prefs.profession,
          interests: prefs.interests,
        },
        onboardingCompleted: true,
      },
    },
    { new: true, runValidators: true },
  )
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  return {
    preferences: user.preferences,
    onboardingCompleted: user.onboardingCompleted,
  }
}