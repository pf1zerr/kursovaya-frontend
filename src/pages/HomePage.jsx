import { useState, useEffect, useCallback } from 'react'
import { getMaterials, getCategories } from '../services/api'
import MaterialCard from '../components/MaterialCard'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'

const DEFAULT_FILTERS = { page: 1, pageSize: 9 }

export default function HomePage() {
  const [result, setResult] = useState({ items: [], totalCount: 0, page: 1, pageSize: 9 })
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search, page: 1 })), 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchMaterials = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: filters.page,
        pageSize: filters.pageSize,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice != null && { minPrice: filters.minPrice }),
        ...(filters.maxPrice != null && { maxPrice: filters.maxPrice }),
      }
      const { data } = await getMaterials(params)
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchMaterials() }, [fetchMaterials])
  useEffect(() => { getCategories().then(r => setCategories(r.data)).catch(() => {}) }, [])

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <h1 style={styles.heroTitle}>
          Study Smarter,<br />
          <span style={styles.heroAccent}>Not Harder.</span>
        </h1>
        <p style={styles.heroSub}>Browse notes, courses, and PDFs from top contributors. Free & premium resources.</p>
        <div style={styles.searchWrap}>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Filters</h3>
            <Filters categories={categories} filters={filters} onChange={setFilters} />
          </aside>

          <div style={styles.main}>
            <div style={styles.topBar}>
              <p style={styles.resultCount}>
                {loading ? 'Loading...' : `${result.totalCount} material${result.totalCount !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div style={styles.loadingGrid}>
                {Array(9).fill(0).map((_, i) => <div key={i} style={styles.skeleton} />)}
              </div>
            ) : result.items.length === 0 ? (
              <div style={styles.empty}>
                <span style={styles.emptyIcon}>No items</span>
                <p style={styles.emptyText}>No materials found</p>
                <p style={styles.emptyHint}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div style={styles.grid}>
                  {result.items.map(m => <MaterialCard key={m.id} material={m} />)}
                </div>
                <div style={styles.paginationWrap}>
                  <Pagination
                    page={result.page}
                    pageSize={result.pageSize}
                    total={result.totalCount}
                    onChange={page => setFilters(f => ({ ...f, page }))}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },
  hero: { padding: '1.8rem 1rem 1.2rem', borderBottom: '1px solid #334155', background: '#111827' },
  heroGlow: { display: 'none' },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#e5e7eb',
    marginBottom: '0.5rem',
  },
  heroAccent: { color: '#60a5fa' },
  heroSub: { color: '#9ca3af', fontSize: '0.95rem', maxWidth: 520, margin: '0 0 1rem' },
  searchWrap: { maxWidth: 560 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '1rem' },
  layout: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' },
  sidebar: {},
  sidebarTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#e5e7eb', marginBottom: '0.75rem' },
  main: {},
  topBar: { marginBottom: '1.25rem' },
  resultCount: { color: '#9ca3af', fontSize: '0.875rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' },
  loadingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' },
  skeleton: { height: 160, background: '#1e293b', borderRadius: 8 },
  empty: { textAlign: 'center', padding: '5rem 1rem' },
  emptyIcon: { display: 'block', fontSize: '1rem', marginBottom: '0.75rem', color: '#9ca3af' },
  emptyText: { color: '#e5e7eb', fontSize: '1rem', fontWeight: 600 },
  emptyHint: { color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.35rem' },
  paginationWrap: { marginTop: '2rem', display: 'flex', justifyContent: 'center' },
}
