import { useEffect, useState } from 'react'
import { changePassword, getMyProfile } from '../services/api'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMyProfile()
      .then((r) => setProfile(r.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Password confirmation does not match')
      return
    }
    setSaving(true)
    try {
      const { data } = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setMsg(data.message || 'Password updated')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Account</h1>

        {loading ? (
          <p style={styles.subtle}>Loading profile...</p>
        ) : (
          <div style={styles.card}>
            <div style={styles.row}><span style={styles.k}>Username</span><span>{profile?.username}</span></div>
            <div style={styles.row}><span style={styles.k}>Email</span><span>{profile?.email}</span></div>
            <div style={styles.row}><span style={styles.k}>Role</span><span>{profile?.role}</span></div>
          </div>
        )}

        <form style={styles.card} onSubmit={onSubmit}>
          <h3 style={styles.section}>Change Password</h3>
          <input type="password" placeholder="Current password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} required />
          <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
          <input type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          {error && <p className="error-msg">{error}</p>}
          {msg && <p style={styles.ok}>{msg}</p>}
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', padding: '2.5rem 1.5rem' },
  container: { maxWidth: 720, margin: '0 auto', display: 'grid', gap: '1rem' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#e8e8f0' },
  subtle: { color: '#8888a8' },
  card: { background: '#111118', border: '1px solid #2a2a38', borderRadius: 12, padding: '1rem', display: 'grid', gap: '0.8rem' },
  row: { display: 'flex', justifyContent: 'space-between', color: '#c8c8d8' },
  k: { color: '#8888a8' },
  section: { fontFamily: 'Syne, sans-serif', color: '#e8e8f0' },
  ok: { color: '#43e8a4', fontSize: '0.9rem' },
}
