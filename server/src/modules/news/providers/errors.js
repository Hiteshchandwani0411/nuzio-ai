// Typed provider errors so callers can degrade gracefully without parsing strings.

export class ProviderError extends Error {
  constructor(code, message, cause) {
    super(message)
    this.name = 'ProviderError'
    this.code = code
    if (cause) this.cause = cause
  }
}

export class ProviderUnavailableError extends ProviderError {
  constructor(message = 'News provider is unavailable', cause) {
    super('provider_unavailable', message, cause)
    this.name = 'ProviderUnavailableError'
  }
}

export class ProviderTimeoutError extends ProviderError {
  constructor(message = 'News provider timed out', cause) {
    super('provider_timeout', message, cause)
    this.name = 'ProviderTimeoutError'
  }
}

export class ProviderRateLimitError extends ProviderError {
  constructor(message = 'News provider rate limit reached', cause) {
    super('provider_rate_limited', message, cause)
    this.name = 'ProviderRateLimitError'
  }
}

export class ProviderMalformedError extends ProviderError {
  constructor(message = 'News provider returned malformed data', cause) {
    super('provider_malformed', message, cause)
    this.name = 'ProviderMalformedError'
  }
}