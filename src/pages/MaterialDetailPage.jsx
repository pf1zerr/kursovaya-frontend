import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMaterial, purchase, checkAccess } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function MaterialDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [material, setMaterial] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMaterial(id)
        setMaterial(data)
        if (user) {
          const acc = await checkAccess(id)
          setHasAccess(acc.data.hasAccess || data.price === 0)
        }
      } catch { }
      setLoading(false)
    }
    load()
  }, [id, user])

  const handlePurchase = async () => {
    setBuying(true)
    setMsg('')
    try {
      await purchase(id)
      setHasAccess(true)
      setMsg('Added to your library')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong')
    } finally {
      setBuying(false)
    }
  }

  if (loading) return <div style={styles.loading}>Loading…</div>
  if (!material) return <div style={styles.loading}>Material not found.</div>

  const isFree = material.price === 0

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>Back to Browse</Link>

        <div style={styles.layout}>
          <div style={styles.main}>
            <div style={styles.header}>
              <span style={styles.category}>{material.category}</span>
              <h1 style={styles.title}>{material.title}</h1>
              <p style={styles.date}>Added {new Date(material.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div style={styles.divider} />

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>About this material</h3>
              <p style={styles.desc}>{material.description}</p>
            </div>

            <div style={styles.meta}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Category</span>
                <span style={styles.metaValue}>{material.category}</span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Format</span>
                <span style={styles.metaValue}>PDF</span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Price</span>
                <span style={styles.metaValue}>{isFree ? 'Free' : `$${material.price.toFixed(2)}`}</span>
              </div>
            </div>
          </div>

          <aside style={styles.sidebar}>
            <div style={styles.actionCard}>
              <div style={styles.priceDisplay}>
                {isFree
                  ? <span style={styles.priceTag}>Free</span>
                  : <span style={styles.priceTag}>${material.price.toFixed(2)}</span>
                }
              </div>

              {!user ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={styles.hint}>Sign in to download this material</p>
                  <Link to="/login">
                    <button className="btn-primary" style={styles.actionBtn}>Sign In to Download</button>
                  </Link>
                </div>
              ) : hasAccess ? (
                <div>
                  <a href={material.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                    <button className="btn-primary" style={{ ...styles.actionBtn, background: '#43e8a4', color: '#0a0a0f' }}>
                      Download
                    </button>
                  </a>
                  <p style={{ color: '#43e8a4', textAlign: 'center', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    In your library
                  </p>
                </div>
              ) : (
                <div>
                  <button className="btn-primary" style={styles.actionBtn} onClick={handlePurchase} disabled={buying}>
                    {buying ? 'Processing…' : isFree ? 'Get for Free' : `Buy for $${material.price.toFixed(2)}`}
                  </button>
                  {msg && <p style={{ color: '#43e8a4', textAlign: 'center', fontSize: '0.82rem', marginTop: '0.5rem' }}>{msg}</p>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', padding: '2rem 1.5rem' },
  container: { maxWidth: 900, margin: '0 auto' },
  loading: { textAlign: 'center', padding: '5rem', color: '#8888a8' },
  back: { color: '#8888a8', fontSize: '0.875rem', fontWeight: 500, display: 'inline-block', marginBottom: '1.5rem', transition: 'color 0.15s' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' },
  main: { background: '#111118', border: '1px solid #2a2a38', borderRadius: 12, padding: '2rem' },
  header: { marginBottom: '1.5rem' },
  category: { display: 'inline-block', background: 'rgba(108,99,255,0.15)', color: '#6c63ff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '0.2rem 0.65rem', borderRadius: 99, marginBottom: '0.75rem' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#e8e8f0', marginBottom: '0.5rem' },
  date: { color: '#8888a8', fontSize: '0.82rem' },
  divider: { height: 1, background: '#2a2a38', margin: '1.5rem 0' },
  section: { marginBottom: '1.5rem' },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#8888a8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' },
  desc: { color: '#c8c8d8', lineHeight: 1.7, fontSize: '0.95rem' },
  meta: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', background: '#1a1a24', borderRadius: 10, padding: '1rem 1.25rem' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  metaLabel: { color: '#8888a8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  metaValue: { color: '#e8e8f0', fontSize: '0.9rem', fontWeight: 600 },
  sidebar: { position: 'sticky', top: '5rem' },
  actionCard: { background: '#111118', border: '1px solid #2a2a38', borderRadius: 12, padding: '1.5rem' },
  priceDisplay: { textAlign: 'center', marginBottom: '1.25rem' },
  priceTag: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#e8e8f0' },
  actionBtn: { width: '100%', padding: '0.8rem', fontSize: '0.95rem', borderRadius: 10 },
  hint: { color: '#8888a8', fontSize: '0.82rem', textAlign: 'center', marginBottom: '1rem' },
}
