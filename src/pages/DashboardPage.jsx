import { useState, useEffect } from 'react'
import { getMyOrders } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <h1 style={styles.title}>My Library</h1>
            <p style={styles.sub}>Hello, <strong style={{ color: '#e8e8f0' }}>{user?.username}</strong> - {orders.length} material{orders.length !== 1 ? 's' : ''} in your collection</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#8888a8' }}>Loading…</p>
        ) : orders.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>No items</span>
            <h3 style={styles.emptyTitle}>Your library is empty</h3>
            <p style={styles.emptyHint}>Browse materials and grab something to read!</p>
            <a href="/">
              <button className="btn-primary" style={{ marginTop: '1.5rem', padding: '0.7rem 1.5rem' }}>
                Browse Materials
              </button>
            </a>
          </div>
        ) : (
          <div style={styles.grid}>
            {orders.map(order => (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.tag}>{order.material.category}</span>
                  <span style={styles.date}>{new Date(order.purchasedAt).toLocaleDateString()}</span>
                </div>
                <h3 style={styles.cardTitle}>{order.material.title}</h3>
                <p style={styles.cardDesc}>{order.material.description}</p>
                <div style={styles.cardFooter}>
                  <span style={order.material.price === 0 ? styles.free : styles.paid}>
                    {order.material.price === 0 ? 'Free' : `$${order.material.price.toFixed(2)}`}
                  </span>
                  <a href={order.material.fileUrl} target="_blank" rel="noreferrer">
                    <button className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                      Download
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', padding: '2.5rem 1.5rem' },
  container: { maxWidth: 1000, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' },
  avatar: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff', flexShrink: 0,
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#e8e8f0' },
  sub: { color: '#8888a8', fontSize: '0.9rem', marginTop: '0.25rem' },
  empty: { textAlign: 'center', padding: '5rem 1rem' },
  emptyIcon: { display: 'block', fontSize: '3rem', marginBottom: '1rem', color: '#2a2a38' },
  emptyTitle: { fontFamily: 'Syne, sans-serif', color: '#e8e8f0', fontSize: '1.2rem', marginBottom: '0.5rem' },
  emptyHint: { color: '#8888a8', fontSize: '0.875rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' },
  card: { background: '#111118', border: '1px solid #2a2a38', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: { background: 'rgba(108,99,255,0.15)', color: '#6c63ff', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: 99 },
  date: { color: '#8888a8', fontSize: '0.75rem' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e8e8f0' },
  cardDesc: { color: '#8888a8', fontSize: '0.83rem', lineHeight: 1.5, flex: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #2a2a38', marginTop: 'auto' },
  free: { color: '#43e8a4', fontSize: '0.82rem', fontWeight: 700 },
  paid: { color: '#e8e8f0', fontSize: '0.82rem', fontWeight: 700 },
}
