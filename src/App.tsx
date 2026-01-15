import { useState, type FormEvent } from 'react'
import './App.css'
import { demoUser, users } from './data/users'
import { isValidEmail } from './utils/validators'

type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  ok: boolean
  message: string
}

const initialErrors = {
  email: '',
  password: '',
  form: '',
}

function App() {
  const [form, setForm] = useState<LoginPayload>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState(initialErrors)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  const updateField = (name: keyof LoginPayload, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '', form: '' }))
    setStatus('idle')
    setMessage('')
  }

  const validate = () => {
    const nextErrors = { ...initialErrors }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    return nextErrors
  }

  const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as LoginResponse
      if (!response.ok) {
        return {
          ok: false,
          message: data.message || 'Unable to sign in. Try again.',
        }
      }

      return {
        ok: true,
        message: data.message || 'Signed in successfully.',
      }
  } catch {
      const match = users.find(
        (user) => user.email === payload.email && user.password === payload.password,
      )

      return match
        ? { ok: true, message: `Welcome back, ${match.name}.` }
        : { ok: false, message: 'Invalid email or password.' }
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)

    const hasErrors = Object.values(nextErrors).some((value) => value.length > 0)
    if (hasErrors) {
      setStatus('error')
      return
    }

    setStatus('loading')
    const response = await loginRequest(form)

    if (response.ok) {
      setStatus('success')
      setMessage(response.message)
    } else {
      setStatus('error')
      setMessage('')
      setErrors((prev) => ({ ...prev, form: response.message }))
    }
  }

  return (
    <main className="app">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <p className="eyebrow">QA Automation Practice</p>
          <h1 id="login-title">Sign in to your account</h1>
          <p className="subtext">
            Use a valid email address and password to access your dashboard.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              aria-invalid={errors.email.length > 0}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            {errors.email ? (
              <span id="email-error" className="error" role="alert">
                {errors.email}
              </span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              aria-invalid={errors.password.length > 0}
              aria-describedby={errors.password ? 'password-error' : undefined}
              required
            />
            {errors.password ? (
              <span id="password-error" className="error" role="alert">
                {errors.password}
              </span>
            ) : null}
          </div>

          {errors.form ? (
            <div className="form-error" role="alert">
              {errors.form}
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="form-success" role="status" aria-live="polite">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            className="primary-button"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <footer className="login-footer">
          <span>Demo account:</span>
          <strong>
            {' '}
            {demoUser
              ? `${demoUser.email} / ${demoUser.password}`
              : 'Set VITE_DEMO_EMAIL and VITE_DEMO_PASSWORD in .env'}
          </strong>
        </footer>
      </section>
    </main>
  )
}

export default App
