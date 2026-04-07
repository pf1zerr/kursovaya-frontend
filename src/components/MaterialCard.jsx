import { Link } from 'react-router-dom'

export default function MaterialCard({ material }) {
  if (!material) return null

  return (
    <article style={styles.card}>
      <div style={styles.top}>
        <span style={styles.category}>{material.category}</span>
        <span style={styles.price}>
          {material.price === 0 ? 'Free' : `$${Number(material.price).toFixed(2)}`}
        </span>
      </div>
      <h3 style={styles.title}>{material.title}</h3>
      <p style={styles.description}>{material.description}</p>
      <Link to={`/materials/${material.id}`} style={styles.link}>
        View details
      </Link>
    </article>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0.9rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.55rem',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    background: '#eef2ff',
    color: '#1d4ed8',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '0.2rem 0.4rem',
    borderRadius: 4,
  },
  price: { color: '#111827', fontWeight: 700, fontSize: '0.85rem' },
  title: { color: '#111827', fontSize: '1rem', fontWeight: 700 },
  description: {
    color: '#6b7280',
    fontSize: '0.85rem',
    lineHeight: 1.45,
    minHeight: 44,
  },
  link: {
    marginTop: 'auto',
    color: '#1d4ed8',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
}
