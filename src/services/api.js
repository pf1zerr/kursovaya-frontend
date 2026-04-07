const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5082/api'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const error = new Error(
      (payload && payload.message) || `Request failed: ${response.status}`,
    )
    error.response = { data: payload }
    throw error
  }

  return { data: payload }
}

export function login(body) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(body) })
}

export function register(body) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(body) })
}

export function getMaterials(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, String(value))
  })
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return request(`/materials${suffix}`)
}

export function getMaterial(id) {
  return request(`/materials/${id}`)
}

export function getCategories() {
  return request('/materials/categories')
}

export function createMaterial(body) {
  return request('/materials', { method: 'POST', body: JSON.stringify(body) })
}

export function updateMaterial(id, body) {
  return request(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export function deleteMaterial(id) {
  return request(`/materials/${id}`, { method: 'DELETE' })
}

export function archiveMaterial(id) {
  return request(`/materials/${id}/archive`, { method: 'PATCH' })
}

export function restoreMaterial(id) {
  return request(`/materials/${id}/restore`, { method: 'PATCH' })
}

export function purchase(materialId) {
  return request(`/orders/${materialId}`, { method: 'POST' })
}

export function checkAccess(materialId) {
  return request(`/orders/has-access/${materialId}`)
}

export function getMyOrders() {
  return request('/orders/my')
}

export function getMyProfile() {
  return request('/auth/me')
}

export function changePassword(body) {
  return request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) })
}
