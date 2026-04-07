import { Link } from 'react-router-dom'

const CATEGORY_COLORS = {
  Mathematics: '#6c63ff',
  Programming: '#43e8a4',
  History: '#ff9f43',
  Chemistry: '#ff6584',
  Languages: '#54a0ff',
  Physics: '#ff6b6b',
  Biology: '#5f27cd',
  default: '#8888a8',
}

export default function MaterialCard({ material }) {
  const { id, title, description, category, price } = material
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.default
  const isFree = price === 0

  return (
    <Link to={`/materials/${id}`} style={{ textDecoration: 'none' }}>
      <div style={styles.card}>
        <div style={{ ...styles.colorBar, background: color }} />
        <div style={styles.body}>
          <div style={styles.topRow}>
            <span style={{ ...styles.category, color, borderColor: `${color}40`, background: `${color}15` }}>
              {category}
            </span>
            <span style={isFree ? styles.free : styles.paid}>
              {isFree ? 'FREE' : `$${price.toFixed(2)}`}
            </span>
          </div>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.desc}>{description}</p>
          <div style={styles.footer}>
            <span style={styles.viewBtn}>View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    background: '#111118',
    border: '1px solid #2a2a38',
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    height: '100%',
    display: 'flex', flexDirection: 'column',
    ':hover': { transform: 'translateY(-4px)' },
  },
  colorBar: { height: 4 },
  body: { padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  category: {
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
    padding: '0.2rem 0.55rem', borderRadius: 99, border: '1px solid',
    textTransform: 'uppercase',
  },
  free: {
    fontSize: '0.8rem', fontWeight: 800, color: '#43e8a4',
    background: 'rgba(67,232,164,0.12)', padding: '0.2rem 0.55rem', borderRadius: 99,
  },
  paid: {
    fontSize: '0.8rem', fontWeight: 800, color: '#e8e8f0',
    background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.55rem', borderRadius: 99,
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#e8e8f0', lineHeight: 1.3 },
  desc: { color: '#8888a8', fontSize: '0.83rem', lineHeight: 1.5, flex: 1,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  footer: { marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #2a2a38' },
  viewBtn: { color: '#6c63ff', fontSize: '0.82rem', fontWeight: 600 },
}
