import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import usePreferences from '../../hooks/usePreferences'
import OnboardingShell from '../../components/onboarding/OnboardingShell'
import { OptionGroup, SelectionChip, ContinueButton } from '../../components/onboarding'
import { useToast } from '../../components/feedback'
import { PROFESSIONS, INTERESTS, LANGUAGES, languageLabel } from '../../features/preferences'
import './Onboarding.css'

const TOTAL_STEPS = 4

function Onboarding() {
  const { user, setUser } = useAuth()
  const { savePreferences, loading: saving } = usePreferences()
  const { show: toast } = useToast()
  const navigate = useNavigate()

  const firstName = (user?.name || '').trim().split(' ')[0]
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({
    profession: null,
    interests: [],
    language: 'en',
  })

  const toggleInterest = (interest) =>
    setSelections((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }))

  const handleSave = async () => {
    try {
      await savePreferences(selections)
      setUser((prev) =>
        prev
          ? { ...prev, preferences: selections, onboardingCompleted: true }
          : prev,
      )
      toast('Your brief profile is saved', 'success')
      navigate('/home')
    } catch {
      toast('Could not save your preferences', 'error')
    }
  }

  const titles = [
    <>What do you <em>do</em>?</>,
    <>What moves your <em>world</em>?</>,
    <>Pick your <em>language</em>.</>,
    firstName ? <>You&rsquo;re ready, <em>{firstName}</em>.</> : <>You&rsquo;re <em>ready</em>.</>,
  ]

  const descriptions = [
    'Tell us your profession so we can shape your briefing.',
    'Select the topics that matter to you. Choose as many as you like.',
    'We’ll deliver your brief in the language you prefer.',
    'Here’s your brief profile before you start listening.',
  ]

  const canContinue =
    !(
      (step === 0 && !selections.profession) ||
      (step === 1 && selections.interests.length === 0)
    )

  return (
    <OnboardingShell
      step={step}
      total={TOTAL_STEPS}
      stepLabel={`Step ${step + 1} of ${TOTAL_STEPS}`}
      title={titles[step]}
      description={descriptions[step]}
      onSkip={() => setStep(TOTAL_STEPS - 1)}
      footer={
        step < TOTAL_STEPS - 1 ? (
          <ContinueButton disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
            Continue
          </ContinueButton>
        ) : (
          <ContinueButton loading={saving} onClick={handleSave}>
            Start listening
          </ContinueButton>
        )
      }
    >
      <div className="onboarding-step" key={step}>
        {step === 0 && (
          <OptionGroup>
            {PROFESSIONS.map((profession) => (
              <SelectionChip
                key={profession}
                label={profession}
                selected={selections.profession === profession}
                onClick={() => setSelections((prev) => ({ ...prev, profession }))}
              />
            ))}
          </OptionGroup>
        )}

        {step === 1 && (
          <OptionGroup>
            {INTERESTS.map((interest) => (
              <SelectionChip
                key={interest}
                label={interest}
                selected={selections.interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              />
            ))}
          </OptionGroup>
        )}

        {step === 2 && (
          <OptionGroup>
            {LANGUAGES.map(({ code, label }) => (
              <SelectionChip
                key={code}
                label={label}
                selected={selections.language === code}
                onClick={() => setSelections((prev) => ({ ...prev, language: code }))}
              />
            ))}
          </OptionGroup>
        )}

        {step === 3 && (
          <div className="brief-profile" aria-live="polite">
            <CheckCircle2 className="brief-profile-check" size={28} aria-hidden="true" />
            <dl className="brief-profile-rows">
              <div className="brief-profile-row">
                <dt>Profession</dt>
                <dd>{selections.profession}</dd>
              </div>
              <div className="brief-profile-row">
                <dt>Topics</dt>
                <dd>{selections.interests.join(', ')}</dd>
              </div>
              <div className="brief-profile-row">
                <dt>Language</dt>
                <dd>{languageLabel(selections.language)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </OnboardingShell>
  )
}

export default Onboarding