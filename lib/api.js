// Velora Rent — API client (Hostinger PHP+MySQL). Same-origin /api/*.php, silent fallback to local demo.
let TOKEN = null;
try { TOKEN = localStorage.getItem('velora_token'); } catch {}
export function setToken(t) { TOKEN = t; try { t ? localStorage.setItem('velora_token', t) : localStorage.removeItem('velora_token'); } catch {} }
export function getToken() { return TOKEN; }

async function req(path, { method = 'GET', body = null, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && TOKEN) headers['Authorization'] = 'Bearer ' + TOKEN;
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch('/api/' + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctrl.signal });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j || j.ok !== true) throw new Error((j && j.error) || ('HTTP ' + r.status));
    return j;
  } finally { clearTimeout(to); }
}

let _server = null; // null=unknown, true/false
export async function serverAvailable() {
  if (_server !== null) return _server;
  try { await req('cars/list.php?limit=1'); _server = true; }
  catch { _server = false; }
  return _server;
}

export function getAdminToken() { try { return sessionStorage.getItem('velora_admin'); } catch { return null; } }
export function setAdminToken(t) { try { t ? sessionStorage.setItem('velora_admin', t) : sessionStorage.removeItem('velora_admin'); } catch {} }

async function areq(path, { method = 'GET', body = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const at = getAdminToken();
  if (at) headers['Authorization'] = 'Bearer ' + at;
  const r = await fetch('/api/admin/' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => null);
  if (!r.ok || !j || j.ok !== true) throw new Error((j && j.error) || ('HTTP ' + r.status));
  return j;
}

export const admin = {
  login: (key) => areq('login.php', { method: 'POST', body: { key } }),
  overview: () => areq('overview.php'),
  bookings: (status = '') => areq('bookings.php' + (status ? '?status=' + status : '')),
  setBooking: (code, status) => areq('bookings.php', { method: 'POST', body: { code, status } }),
  users: () => areq('users.php'),
  inbox: () => areq('inbox.php'),
  cars: () => areq('cars.php'),
  setCar: (slug, patch) => areq('cars.php', { method: 'POST', body: { slug, ...patch } }),
  seedImages: () => areq('seed-images.php', { method: 'POST' }),
};
export const api = {
  register: (d) => req('auth/register.php', { method: 'POST', body: d }),
  login: (d) => req('auth/login.php', { method: 'POST', body: d }),
  me: () => req('auth/me.php', { auth: true }),
  cars: (q = {}) => req('cars/list.php?' + new URLSearchParams(q).toString()),
  companies: () => req('companies/list.php'),
  book: (d) => req('bookings/create.php', { method: 'POST', body: d, auth: true }),
  myBookings: () => req('bookings/mine.php', { auth: true }),
  cancelBooking: (code) => req('bookings/cancel.php', { method: 'POST', body: { code }, auth: true }),
  account: () => req('account/me.php', { auth: true }),
  verifyIdentity: () => req('account/verify-identity.php', { method: 'POST', auth: true }),
  gift: (amount) => req('account/gift.php', { method: 'POST', body: { amount }, auth: true }),
  reviews: () => req('reviews.php'),
  addReview: (d) => req('reviews.php', { method: 'POST', body: d }),
  form: (d) => req('forms.php', { method: 'POST', body: d }),
};
