import { ArrowRight, Check, Headphones, Mic, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink, Card, Logo } from '../../components/ui'
import './Landing.css'

const features = [
  {
    icon: Sparkles,
    title: 'AI-curated brief',
    text: 'Every morning, Nuzio filters the signal from the noise and keeps only the stories that move your work and interest stack.',
  },
  {
    icon: Headphones,
    title: 'Audio-first delivery',
    text: 'Listen on the go with a clean, narrated feed designed for busy professionals and founders who prefer speed over scrolling.',
  },
  {
    icon: Mic,
    title: 'Voice tuned for you',
    text: 'Choose the voice and context that feels right — from quick recaps to deeper audio explainers — without losing the brief format.',
  },
  {
    icon: TrendingUp,
    title: 'Built for relevance',
    text: 'Your profession, topics, and language shape an always-personalized feed so the brief is consistently aligned with your priorities.',
  },
]

const phoneCards = [
  {
    title: 'Good morning, Aarav —',
    label: 'AI & Tech',
    accent: 'purple',
    story: 'Anthropic ships Claude 4.5 with 2M-token memory and native tools.',
  },
  {
    title: 'What moves your world?',
    label: 'Markets',
    accent: 'green',
    story: 'Fed minutes hint at a September policy shift toward target-bound easing.',
  },
  {
    title: 'Your brief is ready',
    label: 'Technology',
    accent: 'purple',
    story: 'Your morning brief will be ready tomorrow at 7:00 AM.',
  },
]

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="page-container landing-header-inner">
          <div className="landing-brand">
            <Logo size="app-header" wordmark />
          </div>

          <nav className="landing-nav" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="landing-actions">
            <Link to="/login" className="landing-signin">
              Sign in
            </Link>
            <ButtonLink to="/login" variant="primary" size="md">
              Continue with Google
            </ButtonLink>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="page-container landing-hero-inner">
            <div className="landing-copy">
              <span className="eyebrow">Designed for busy people</span>
              <h1>
                A smarter morning brief for the people building what&rsquo;s next.
              </h1>
              <p>
                Nuzio turns headlines, market movements, and product updates into a short,
                personalized audio briefing — delivered before the day gets noisy.
              </p>

              <div className="hero-actions">
                <ButtonLink to="/login" variant="primary" size="lg" className="landing-primary-cta">
                  <span>Start free</span>
                  <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink to="/login" variant="secondary" size="lg">
                  Watch demo
                </ButtonLink>
              </div>

              <div className="trust-row" aria-label="Key benefits">
                <div>
                  <strong>12k+</strong>
                  <span>daily brief listeners</span>
                </div>
                <div>
                  <strong>4 min</strong>
                  <span>average brief length</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>personalized reading loop</span>
                </div>
              </div>
            </div>

            <div className="landing-visual" aria-label="Nuzio app preview">
              <div className="glass-stage">
                <div className="phone-stack">
                  <div className="phone phone--left">
                    <div className="phone-topbar">
                      <span>9:41</span>
                      <div className="phone-icons">
                        <span className="dot" />
                        <span className="dot" />
                      </div>
                    </div>
                    <div className="phone-content">
                      <div className="mini-title">Step 5 of 6</div>
                      <h3>Stay in the loop.</h3>
                      <p>Turn on notifications so you never miss your brief.</p>
                      <div className="brief-card">
                        <div className="brief-pill">Nuzio</div>
                        <div className="brief-row">
                          <span>Your morning brief is ready</span>
                          <span>7:00 AM</span>
                        </div>
                      </div>
                      <div className="mini-list">
                        <div>
                          <span className="mini-tag purple">AI</span>
                          <span>Morning brief ready</span>
                        </div>
                        <div>
                          <span className="mini-tag teal">Tech</span>
                          <span>Breaking story</span>
                        </div>
                      </div>
                      <span className="phone-cta">Allow notifications</span>
                    </div>
                  </div>

                  <div className="phone phone--center">
                    <div className="phone-topbar">
                      <span>9:41</span>
                      <div className="phone-icons">
                        <span className="dot" />
                        <span className="dot" />
                      </div>
                    </div>
                    <div className="phone-content">
                      <div className="toolbar-row">
                        <span className="chip active">All</span>
                        <span className="chip">AI &amp; Tech</span>
                        <span className="chip">Markets</span>
                      </div>
                      <h4>Good morning, Aarav —</h4>
                      <div className="story-card">
                        <div className="story-meta">
                          <span className="live-dot" />
                          <span>Audio</span>
                        </div>
                        <div className="story-title">
                          Anthropic ships Claude 4.5 with 2M-token memory and native tools.
                        </div>
                        <div className="story-footer">
                          <span>3 min read</span>
                          <span className="preview-play">▶</span>
                        </div>
                      </div>
                      <div className="audio-controls">
                        <span className="circle-btn">⏮</span>
                        <span className="circle-btn main">▶</span>
                        <span className="circle-btn">⏭</span>
                      </div>
                    </div>
                  </div>

                  <div className="phone phone--right">
                    <div className="phone-topbar">
                      <span>9:41</span>
                      <div className="phone-icons">
                        <span className="dot" />
                        <span className="dot" />
                      </div>
                    </div>
                    <div className="phone-content">
                      <h4>Discover</h4>
                      <div className="search-box">Search stories, sources, topics...</div>
                      <div className="filter-row">
                        <span className="chip active">All</span>
                        <span className="chip">AI &amp; Tech</span>
                        <span className="chip">Markets</span>
                      </div>
                      <div className="list-story">
                        <span className="list-pill">AI &amp; Tech</span>
                        <p>Anthropic ships Claude 4.5 with 2M-token memory and native tools.</p>
                      </div>
                      <div className="list-story">
                        <span className="list-pill green">Global</span>
                        <p>Fed minutes hint at a September policy shift toward target-bound easing.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-feature-section" id="features">
          <div className="page-container">
            <div className="section-heading">
              <span className="eyebrow">Why Nuzio</span>
              <h2>Everything you need before the first coffee.</h2>
            </div>

            <div className="feature-grid">
              {features.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="feature-card" interactive>
                  <div className="feature-icon">
                    <Icon size={18} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-showcase" id="how-it-works">
          <div className="page-container showcase-grid">
            <div className="showcase-copy">
              <span className="eyebrow">Built for your rhythm</span>
              <h2>From a few preferences to a polished brief.</h2>
              <p>
                Set your interests, profession, and language once. Nuzio assembles a briefing that
                feels curated, useful, and easy to consume from the moment you wake up.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={16} />
                  Personalized by profession and interest signals
                </li>
                <li>
                  <Check size={16} />
                  Smart audio narration with morning delivery windows
                </li>
                <li>
                  <Check size={16} />
                  Clean mobile-first experience built for fast scanning
                </li>
              </ul>
            </div>

            <div className="showcase-stack">
              {phoneCards.map(({ title, label, accent, story }) => (
                <div key={title} className={`mini-phone mini-phone--${accent}`}>
                  <div className="mini-phone-header">
                    <span className="mini-pill">Nuzio</span>
                    <span className="mini-status">9:41</span>
                  </div>
                  <div className="mini-phone-body">
                    <span className="mini-label">{label}</span>
                    <h4>{title}</h4>
                    <p>{story}</p>
                    <div className="mini-footer">
                      <span>3 min read</span>
                      <span className="preview-play">▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-pricing" id="pricing">
          <div className="page-container pricing-shell">
            <div className="pricing-copy">
              <span className="eyebrow">Simple pricing</span>
              <h2>Start free. Upgrade when your briefing gets serious.</h2>
            </div>

            <div className="pricing-cards">
              <Card className="pricing-card pricing-card--base">
                <p className="pricing-tier">Free</p>
                <div className="pricing-price">
                  ₹0<span>/mo</span>
                </div>
                <ul>
                  <li>Basic personalized brief</li>
                  <li>Daily morning digest</li>
                  <li>Limited listening history</li>
                </ul>
                <ButtonLink to="/login" variant="secondary" fullWidth>
                  Get started
                </ButtonLink>
              </Card>

              <Card className="pricing-card pricing-card--featured">
                <span className="featured-badge">Most popular</span>
                <p className="pricing-tier">Pro</p>
                <div className="pricing-price">
                  ₹799<span>/mo</span>
                </div>
                <ul>
                  <li>Unlimited audio briefings</li>
                  <li>Multiple professional interests</li>
                  <li>Faster switching and custom delivery</li>
                </ul>
                <ButtonLink to="/login" variant="primary" fullWidth>
                  Upgrade to Pro
                </ButtonLink>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
