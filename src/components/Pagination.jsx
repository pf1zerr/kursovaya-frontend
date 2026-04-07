export default function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)))

  return (
    <div style={styles.wrap}>
      <button
        className="btn-ghost"
        style={styles.btn}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      <span style={styles.text}>
        Page {page} of {totalPages}
      </span>
      <button
        className="btn-ghost"
        style={styles.btn}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  )
}

const styles = {
  wrap: { display: 'flex', alignItems: 'center', gap: '0.65rem' },
  btn: { padding: '0.4rem 0.85rem', fontSize: '0.82rem' },
  text: { color: '#4b5563', fontSize: '0.85rem' },
}
