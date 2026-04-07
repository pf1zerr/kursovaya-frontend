import { useState, useEffect } from 'react'
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  archiveMaterial,
  restoreMaterial,
} from '../services/api'

const EMPTY_FORM = { title: '', description: '', category: '', price: 0, fileUrl: '' }

export default function AdminPage() {
  const [materials, setMaterials] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const { data } = await getMaterials({ page: p, pageSize: 10, includeArchived: true })
      setMaterials(data.items)
      setTotal(data.totalCount)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { load() }, [page])

  const openCreate = () => {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setMsg('')
    setShowForm(true)
  }

  const openEdit = (m) => {
    setEditItem(m)
    setForm({ title: m.title, description: m.description, category: m.category, price: m.price, fileUrl: m.fileUrl })
    setMsg('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      if (editItem) {
        await updateMaterial(editItem.id, { ...form, price: parseFloat(form.price) })
        setMsg('Updated successfully')
      } else {
        await createMaterial({ ...form, price: parseFloat(form.price) })
        setMsg('Created successfully')
      }
      await load()
      setTimeout(() => { setShowForm(false); setMsg('') }, 1000)
    } catch {
      setMsg('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMaterial(id)
      setDeleteConfirm(null)
      await load()
    } catch { }
  }

  const handleArchiveToggle = async (m) => {
    try {
      if (m.isArchived) await restoreMaterial(m.id)
      else await archiveMaterial(m.id)
      await load()
    } catch { }
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Panel</h1>
            <p style={styles.sub}>{total} materials total</p>
          </div>
          <button className="btn-primary" style={{ padding: '0.65rem 1.25rem' }} onClick={openCreate}>
            + New Material
          </button>
        </div>

        {showForm && (
          <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{editItem ? 'Edit Material' : 'New Material'}</h2>
                <button style={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} style={styles.form}>
                {[
                  { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Calculus Made Easy' },
                  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Mathematics' },
                  { key: 'fileUrl', label: 'File URL', type: 'url', placeholder: 'https://example.com/file.pdf' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key} style={styles.field}>
                    <label style={styles.label}>{label}</label>
                    <input type={type} placeholder={placeholder} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div style={styles.field}>
                  <label style={styles.label}>Price ($)</label>
                  <input type="number" min="0" step="0.01" placeholder="0 for free" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Description</label>
                  <textarea rows={3} placeholder="Describe this material..." required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
                {msg && <p style={{ color: msg.includes('successfully') ? '#43e8a4' : '#ff6584', fontSize: '0.875rem' }}>{msg}</p>}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
            <div style={{ ...styles.modal, maxWidth: 380, textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e8f0', marginBottom: '0.75rem' }}>Delete Material?</h2>
              <p style={{ color: '#8888a8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                "<strong style={{ color: '#e8e8f0' }}>{deleteConfirm.title}</strong>" will be permanently deleted.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.tableWrap}>
          {loading ? (
            <div style={styles.loadingMsg}>Loading…</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['ID', 'Title', 'Category', 'Price', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.idBadge}>#{m.id}</span></td>
                    <td style={{ ...styles.td, maxWidth: 220 }}>
                      <span style={styles.materialTitle}>{m.title}</span>
                    </td>
                    <td style={styles.td}><span style={styles.catTag}>{m.category}</span></td>
                    <td style={styles.td}>
                      <span style={m.price === 0 ? styles.freeTag : styles.paidTag}>
                        {m.price === 0 ? 'Free' : `$${m.price.toFixed(2)}`}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={m.isArchived ? styles.archivedTag : styles.activeTag}>
                        {m.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(m)}>Edit</button>
                        <button className="btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleArchiveToggle(m)}>
                          {m.isArchived ? 'Restore' : 'Archive'}
                        </button>
                        <button className="btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setDeleteConfirm(m)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button className="btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.45rem 0.9rem' }}>Prev</button>
            <span style={{ color: '#8888a8', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
            <button className="btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.45rem 0.9rem' }}>Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', padding: '2.5rem 1.5rem' },
  container: { maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#e8e8f0' },
  sub: { color: '#8888a8', fontSize: '0.9rem', marginTop: '0.25rem' },
  tableWrap: { background: '#111118', border: '1px solid #2a2a38', borderRadius: 12, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#8888a8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #2a2a38' },
  tr: { borderBottom: '1px solid #1a1a24', transition: 'background 0.1s' },
  td: { padding: '0.85rem 1rem', fontSize: '0.875rem', color: '#c8c8d8', verticalAlign: 'middle' },
  idBadge: { color: '#8888a8', fontFamily: 'monospace', fontSize: '0.8rem' },
  materialTitle: { color: '#e8e8f0', fontWeight: 600 },
  catTag: { background: 'rgba(108,99,255,0.15)', color: '#6c63ff', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: 99 },
  freeTag: { color: '#43e8a4', fontWeight: 700, fontSize: '0.82rem' },
  paidTag: { color: '#e8e8f0', fontWeight: 700, fontSize: '0.82rem' },
  activeTag: { color: '#43e8a4', fontWeight: 700, fontSize: '0.8rem' },
  archivedTag: { color: '#ff6584', fontWeight: 700, fontSize: '0.8rem' },
  loadingMsg: { padding: '3rem', textAlign: 'center', color: '#8888a8' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem',
  },
  modal: {
    background: '#111118', border: '1px solid #2a2a38', borderRadius: 16,
    padding: '2rem', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#e8e8f0' },
  closeBtn: { background: 'none', border: 'none', color: '#8888a8', fontSize: '1rem', cursor: 'pointer', padding: '0.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { color: '#8888a8', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
}
