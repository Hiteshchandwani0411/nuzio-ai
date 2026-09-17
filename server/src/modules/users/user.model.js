import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },

    preferences: {
      language: { type: String, trim: true, maxlength: 24 },
      profession: { type: String, trim: true, maxlength: 80 },
      interests: [{ type: String, trim: true, maxlength: 40 }],
    },

    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

userSchema.methods.toSafeObject = function toSafeObject() {
  const { _id, name, email, preferences, onboardingCompleted, createdAt } = this.toObject()
  return {
    id: _id,
    name,
    email,
    preferences: preferences || { language: null, profession: null, interests: [] },
    onboardingCompleted,
    createdAt,
  }
}

const User = mongoose.model('User', userSchema)

export default User