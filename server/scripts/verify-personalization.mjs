// Two-user personalization regression check.
//
// Ensures GET /api/news/personalized is personalized: two user profiles with
// clearly different preferences must rank different categories first, and the
// response must never leak raw scores.
//
// The script creates or reuses two dev users, saves distinct preferences via
// the API, and asserts on the returned briefs. Run against a running server:
//
//   npm run verify:personalization            # -> http://localhost:5000
//   npm run verify:personalization http://localhost:5005
import assert from 'node:assert/strict'

const BASE = (process.argv[2] || 'http://localhost:5000').replace(/\/$/, '')

const PROFILES = [
  {
    label: 'USER A',
    email: 'hitesh.chandwani251133@gmail.com',
    password: 'Hitesh@1234d',
    prefs: { profession: 'Engineer', interests: ['Technology', 'AI', 'Startups'], language: 'en' },
    expectTopCategory: 'Technology',
  },
  {
    label: 'USER B',
    email: 'piyushkhandelwal@gmail.com',
    password: 'Piyush@1234d',
    prefs: { profession: 'Investor', interests: ['Finance', 'Markets'], language: 'en' },
    expectTopCategory: 'Finance',
  },
]

async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = null
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { status: res.status, data }
}

async function tokenFor(profile) {
  let login = await api('/api/auth/login', {
    method: 'POST',
    body: { email: profile.email, password: profile.password },
  })
  if (login.status !== 200) {
    const created = await api('/api/auth/register', {
      method: 'POST',
      body: { name: profile.label.replace('USER ', 'User '), email: profile.email, password: profile.password },
    })
    if (created.status >= 400) {
      throw new Error(`Cannot login or register ${profile.email}: ${login.status}/${created.status}`)
    }
    login = await api('/api/auth/login', {
      method: 'POST',
      body: { email: profile.email, password: profile.password },
    })
  }
  assert.equal(login.status, 200, `login ok for ${profile.email}`)
  return login.data.token
}

async function fetchBrief(profile) {
  const token = await tokenFor(profile)
  const saved = await api('/api/users/preferences', { method: 'PUT', body: profile.prefs, token })
  assert.equal(saved.status, 200, `preferences saved for ${profile.email}`)

  const res = await api('/api/news/personalized', { token })
  assert.equal(res.status, 200, `personalized feed ok for ${profile.label}`)
  return { res: res.data, token }
}

function assertNoScoreLeak(payload, label) {
  assert.ok(!payload.brief.score, `${label}: no score in brief`)
  assert.equal(JSON.stringify(payload).includes('"score"'), false, `${label}: no score key anywhere`)
}

function topCategories(payload) {
  return payload.articles.slice(0, 5).map((a) => a.category)
}

async function main() {
  const results = []
  for (const profile of PROFILES) {
    const { res } = await fetchBrief(profile)
    assertNoScoreLeak(res, profile.label)

    assert.ok(res.brief, `${profile.label}: brief present`)
    assert.equal(Array.isArray(res.articles), true, `${profile.label}: articles array`)
    assert.equal(res.articles.length, 12, `${profile.label}: 12 stories`)
    assert.ok(['live', 'sampled'].includes(res.provider.mode), `${profile.label}: provider mode`)

    for (const a of res.articles) {
      for (const field of ['id', 'title', 'category', 'audioUrl', 'duration']) {
        assert.ok(a[field] !== undefined && a[field] !== null, `${profile.label}: story field ${field}`)
      }
    }

    const top = topCategories(res)
    const count = top.filter((c) => c === profile.expectTopCategory).length
    console.log(`${profile.label}: top5=[${top.join(', ')}] (${profile.expectTopCategory}: ${count}/5)`)
    assert.ok(count >= 3, `${profile.label}: ${profile.expectTopCategory} dominates top-5`)

    results.push({ profile, res })
  }

  const [a, b] = results
  // Distinct first stories across the two users.
  assert.notEqual(a.res.articles[0].id, b.res.articles[0].id, 'users see a different top story')
  assert.notEqual(a.res.articles[0].category, b.res.articles[0].category, 'users see a different top category')

  // Reproducibility: a second call for USER A returns the same ordering.
  const { res: again } = await fetchBrief(results[0].profile)
  const firstIds = results[0].res.articles.slice(0, 5).map((x) => x.id)
  const againIds = again.articles.slice(0, 5).map((x) => x.id)
  assert.deepEqual(againIds, firstIds, 'USER A ordering reproducible')

  console.log('\nverify-personalization: all assertions passed')
}

main().catch((err) => {
  console.error('verify-personalization FAILED:', err.message)
  process.exit(1)
})