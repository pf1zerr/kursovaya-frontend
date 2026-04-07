import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoMark}>SH</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.sub}>Sign in to access your library</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-primary" style={styles.submit} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={styles.hint}>
          <span style={{ color: '#8888a8', fontSize: '0.875rem' }}>
            Demo admin: <code style={styles.code}>admin@studyhub.com</code> / <code style={styles.code}>admin123</code>
          </span>
        </div>

        <p style={styles.footer}>
          No account?{' '}
          <Link to="/register" style={{ color: '#1d4ed8', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#111827', border: '1px solid #334155',
    borderRadius: 8, padding: '1.2rem', width: '100%', maxWidth: 400,
  },
  header: { textAlign: 'center', marginBottom: '1rem' },
  logoMark: { fontSize: '1rem', color: '#60a5fa', marginBottom: '0.35rem', fontWeight: 700 },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#e5e7eb', margin: 0 },
  sub: { color: '#9ca3af', marginTop: '0.35rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600 },
  submit: { marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.95rem', width: '100%', borderRadius: 10 },
  hint: { marginTop: '1rem', background: '#0b1220', borderRadius: 6, padding: '0.65rem 0.75rem' },
  code: { background: '#1e293b', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.8rem', color: '#e5e7eb' },
  footer: { textAlign: 'center', marginTop: '1rem', color: '#9ca3af', fontSize: '0.875rem' },
}
