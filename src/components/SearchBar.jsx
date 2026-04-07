export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by title or description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.input}
    />
  )
}

const styles = {
  input: {
    width: '100%',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    color: '#111827',
    fontSize: '0.95rem',
    padding: '0.65rem 0.8rem',
    outline: 'none',
  },
}
