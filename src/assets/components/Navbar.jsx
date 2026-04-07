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
          <span style={styles.logoIcon}>◈</span>
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
          {isAdmin && (
            <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>
              <span style={styles.adminBadge}>Admin</span>
            </Link>
          )}
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              <span style={styles.username}>👤 {user.username}</span>
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
    background: 'rgba(10,10,15,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid #2a2a38',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    padding: '0 1.5rem',
    height: 64,
    display: 'flex', alignItems: 'center', gap: '2rem',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem',
  },
  logoIcon: { color: '#6c63ff', fontSize: '1.4rem' },
  logoText: { color: '#e8e8f0' },
  links: { display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 },
  link: {
    color: '#8888a8', fontWeight: 500, fontSize: '0.9rem',
    padding: '0.4rem 0.75rem', borderRadius: 8, transition: 'all 0.15s',
  },
  linkActive: { color: '#e8e8f0', background: '#1a1a24' },
  adminBadge: {
    background: 'rgba(108,99,255,0.2)', color: '#6c63ff',
    padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700,
  },
  actions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  username: { color: '#8888a8', fontSize: '0.875rem', fontWeight: 500 },
}
