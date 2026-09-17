import { z } from 'zod'

export const preferencesSchema = z.object({
  language: z.string().min(2).max(24).optional(),
  profession: z.string().min(2).max(80),
  interests: z.array(z.string().min(1).max(40)).min(1).max(24),
})