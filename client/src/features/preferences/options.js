// Preference options collected during onboarding.
// Kept outside the page components so data can be swapped for API-driven options later.

export const PROFESSIONS = [
  'Student',
  'Engineer',
  'Designer',
  'Marketer',
  'Founder',
  'Investor',
  'Researcher',
  'Creator',
  'Other',
]

export const INTERESTS = [
  'Technology',
  'Finance',
  'Politics',
  'Sports',
  'Health',
  'Science',
  'Culture',
  'Climate',
]

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
]

export function languageLabel(code) {
  return LANGUAGES.find((l) => l.code === code)?.label || code
}