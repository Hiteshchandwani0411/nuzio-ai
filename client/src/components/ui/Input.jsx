import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './Input.css'

function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  disabled,
  leadingIcon,
  placeholder,
  autoComplete,
  required,
  multiline = false,
  rows = 3,
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (visible ? 'text' : 'password') : type
  const describedBy = error || hint ? `${name}-feedback` : undefined

  const shellProps = {
    className: ['input-shell', error && 'input-shell--error', leadingIcon && 'input-shell--icon']
      .filter(Boolean)
      .join(' '),
  }

  return (
    <div className="input-field">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-required"> *</span>}
        </label>
      )}

      <div className={shellProps.className}>
        {leadingIcon && <span className="input-icon">{leadingIcon}</span>}

        {multiline ? (
          <textarea
            className="input input--textarea"
            id={name}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy}
          />
        ) : (
          <input
            className="input"
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
          />
        )}

        {isPassword && !multiline && (
          <button
            type="button"
            className="input-action"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {(error || hint) && (
        <p id={describedBy} className={error ? 'input-error' : 'input-hint'}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

export default Input