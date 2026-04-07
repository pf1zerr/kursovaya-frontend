import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>SH</span>
          <span style={styles.logoText}>StudyHub</span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>
            Browse
          </Link>
          {user && (
            <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}>
              My Library
            </Link>
          )}
          {user && (
            <Link to="/profile" style={{ ...styles.link, ...(isActive('/profile') ? styles.linkActive : {}) }}>
              Account
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>
              <span style={styles.adminBadge}>Admin</span>
            </Link>
          )}
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              <span style={styles.username}>{user.username}</span>
              <button className="btn-ghost" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Sign in</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: '#111827',
    borderBottom: '1px solid #334155',
  },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    padding: '0 1rem',
    height: 58,
    display: 'flex', alignItems: 'center', gap: '2rem',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    fontWeight: 700, fontSize: '1.1rem',
  },
  logoIcon: { color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700 },
  logoText: { color: '#e5e7eb' },
  links: { display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 },
  link: {
    color: '#9ca3af', fontWeight: 500, fontSize: '0.9rem',
    padding: '0.35rem 0.6rem', borderRadius: 6, transition: 'all 0.15s',
  },
  linkActive: { color: '#e5e7eb', background: '#1e293b' },
  adminBadge: {
    background: '#1e3a8a', color: '#bfdbfe',
    padding: '0.2rem 0.45rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700,
  },
  actions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  username: { color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 },
}
