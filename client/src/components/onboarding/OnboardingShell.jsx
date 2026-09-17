import Logo from '../ui/Logo'
import StepIndicator from './StepIndicator'
import './OnboardingShell.css'

function OnboardingShell({ step, total, stepLabel, title, description, children, footer, onSkip }) {
  return (
    <div className="onboarding-shell">
      <header className="onboarding-header">
        <Logo size="app-header" wordmark />
        {onSkip && (
          <button type="button" className="onboarding-skip" onClick={onSkip}>
            Skip →
          </button>
        )}
      </header>

      <div className="onboarding-body page-container onboarding-body--narrow">
        <div className="onboarding-progress">
          <span className="onboarding-step-count">{stepLabel}</span>
          <StepIndicator step={step} total={total} />
        </div>

        <h1 className="onboarding-title">{title}</h1>
        {description && <p className="onboarding-desc">{description}</p>}

        <div className="onboarding-content">{children}</div>
      </div>

      {footer && (
        <footer className="onboarding-footer">
          <div className="page-container onboarding-body--narrow">{footer}</div>
        </footer>
      )}
    </div>
  )
}

export default OnboardingShell