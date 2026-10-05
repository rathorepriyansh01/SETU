const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://setu-ffwk.onrender.com/api').replace(/\/$/, '');

async function request(url, options = {}) {
  const token = localStorage.getItem('setu_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: 'HTTP Request failed' }));
      throw new Error(errData.detail || `Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // Patient / Public
  getHospitals: () => request('/hospitals'),
  getHospitalById: (id) => request(`/hospitals/${id}`),
  searchHealthcare: (query) => request('/healthcare/search', { method: 'POST', body: JSON.stringify({ query }) }),
  createEmergency: (data) => request('/emergency', { method: 'POST', body: JSON.stringify(data) }),
  trackEmergency: (id) => request(`/emergency/${id}`),

  // Dispatcher
  getDispatcherEmergencies: () => request('/dispatcher/emergencies'),
  getDispatcherEmergencyDetail: (id) => request(`/dispatcher/emergencies/${id}`),
  getRecommendations: (emergencyId) => request(`/dispatcher/recommendations/${emergencyId}`),
  getAmbulances: (lat, lng) => request(`/dispatcher/ambulances?lat=${lat || ''}&lng=${lng || ''}`),
  assignEmergency: (data) => request('/dispatcher/assign', { method: 'POST', body: JSON.stringify(data) }),

  // Hospital Admin
  getHospitalDashboard: (hospitalId = 1) => request(`/hospital/dashboard?hospital_id=${hospitalId}`),
  updateHospitalCapacity: (hospitalId, data) => request(`/hospital/capacity?hospital_id=${hospitalId}`, { method: 'PUT', body: JSON.stringify(data) }),
  getPrealerts: (hospitalId = 1) => request(`/hospital/prealerts?hospital_id=${hospitalId}`),
  acceptPrealert: (id) => request(`/hospital/prealerts/${id}/accept`, { method: 'POST' }),
  rejectPrealert: (id, reason) => request(`/hospital/prealerts/${id}/reject?reason=${encodeURIComponent(reason)}`, { method: 'POST' }),
  patientReceived: (id) => request(`/hospital/prealerts/${id}/received`, { method: 'POST' }),
  getInventory: (hospitalId = 1) => request(`/hospital/inventory?hospital_id=${hospitalId}`),
  getForecast: (hospitalId = 1) => request(`/hospital/forecast?hospital_id=${hospitalId}`),

  // Health Officer Admin
  getCommandCenter: () => request('/admin/command-center'),
  getDataFreshnessCenter: () => request('/admin/freshness'),
  getRedistributionOpps: () => request('/admin/redistribution'),
  approveRedistribution: (id) => request(`/admin/redistribution/${id}/approve`, { method: 'POST' }),
  rejectRedistribution: (id) => request(`/admin/redistribution/${id}/reject`, { method: 'POST' }),
  runSimulation: (data) => request('/admin/simulation', { method: 'POST', body: JSON.stringify(data) }),
  getEvaluation: () => request('/admin/evaluation'),
  getAuditTrail: () => request('/admin/audit-events')
};
