export default function Filters({ categories, filters, onChange }) {
  const update = (patch) => onChange((prev) => ({ ...prev, ...patch, page: 1 }))

  return (
    <div style={styles.wrap}>
      <div style={styles.group}>
        <label style={styles.label}>Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => update({ category: e.target.value || undefined })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Min price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.minPrice ?? ''}
          onChange={(e) =>
            update({ minPrice: e.target.value === '' ? undefined : Number(e.target.value) })
          }
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Max price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.maxPrice ?? ''}
          onChange={(e) =>
            update({ maxPrice: e.target.value === '' ? undefined : Number(e.target.value) })
          }
        />
      </div>

      <button
        className="btn-ghost"
        onClick={() => onChange({ page: 1, pageSize: filters.pageSize || 9 })}
      >
        Reset filters
      </button>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0.9rem',
  },
  group: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: {
    color: '#4b5563',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
}
