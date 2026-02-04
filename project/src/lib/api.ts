const AUTH_URL = import.meta.env.VITE_AUTH_URL ?? 'http://localhost:8001';
const SHIPMENTS_URL = import.meta.env.VITE_SHIPMENTS_URL ?? 'http://localhost:8002';
const FINANCE_URL = import.meta.env.VITE_FINANCE_URL ?? 'http://localhost:8003';
const WMS_URL = import.meta.env.VITE_WMS_URL ?? 'http://localhost:8004';

export const endpoints = {
  AUTH_URL,
  SHIPMENTS_URL,
  FINANCE_URL,
  WMS_URL,
};

export function getToken() {
  return localStorage.getItem('auth_token') || '';
}

export function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function clearToken() {
  localStorage.removeItem('auth_token');
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export const api = {
  authLogin: (username: string, password: string) =>
    request<{ access_token: string }>(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  authMe: () => request<{ id: number; username: string; full_name?: string; roles: string[] }>(`${AUTH_URL}/auth/me`),
  authLogout: () => request(`${AUTH_URL}/auth/logout`, { method: 'POST' }),
  listUsers: () => request<any[]>(`${AUTH_URL}/users`),
  createUser: (payload: { username: string; password: string; full_name?: string; roles: string[] }) =>
    request<any>(`${AUTH_URL}/users`, { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id: number, payload: { full_name?: string; roles?: string[]; is_active?: boolean }) =>
    request<any>(`${AUTH_URL}/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  createClient: (payload: { full_name: string; document_id: string; phone?: string }) =>
    request<{ id: number }>(`${AUTH_URL}/clients`, { method: 'POST', body: JSON.stringify(payload) }),

  listShipments: () => request<any[]>(`${SHIPMENTS_URL}/shipments`),
  getShipment: (id: number) => request<any>(`${SHIPMENTS_URL}/shipments/${id}`),
  createShipment: (payload: any) => request<any>(`${SHIPMENTS_URL}/shipments`, { method: 'POST', body: JSON.stringify(payload) }),
  cancelShipment: (id: number) => request(`${SHIPMENTS_URL}/shipments/${id}/cancel`, { method: 'PUT' }),
  updateShipmentStatus: (id: number, status: string) =>
    request<any>(`${SHIPMENTS_URL}/shipments/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }),
  generateQr: (id: number) => request<any>(`${SHIPMENTS_URL}/shipments/${id}/qr`, { method: 'POST' }),
  generateDocuments: (shipment_id: number, doc_types: string[]) =>
    request<any[]>(`${SHIPMENTS_URL}/documents/generate`, { method: 'POST', body: JSON.stringify({ shipment_id, doc_types }) }),
  getDocument: (id: number) => request<any>(`${SHIPMENTS_URL}/documents/${id}`),
  scan: (payload: { shipment_id: number; scanned_by: string; location: string }) =>
    request<any>(`${SHIPMENTS_URL}/scan`, { method: 'POST', body: JSON.stringify(payload) }),

  listCells: (status?: string) => request<any[]>(`${WMS_URL}/wms/cells${status ? `?status=${status}` : ''}`),
  openCell: (cell_id: number) => request(`${WMS_URL}/wms/cells/open?cell_id=${cell_id}`, { method: 'POST' }),
  closeCell: (cell_id: number) => request(`${WMS_URL}/wms/cells/close?cell_id=${cell_id}`, { method: 'POST' }),
  assignCell: (cell_id: number, shipment_id: number) =>
    request(`${WMS_URL}/wms/assign?cell_id=${cell_id}&shipment_id=${shipment_id}`, { method: 'POST' }),
  removeCell: (cell_id: number) => request(`${WMS_URL}/wms/remove?cell_id=${cell_id}`, { method: 'POST' }),
  createMeasurement: (payload: any) => request<any>(`${WMS_URL}/measurements`, { method: 'POST', body: JSON.stringify(payload) }),
  createRoutePlan: (payload: any) => request<any>(`${WMS_URL}/routes/plan`, { method: 'POST', body: JSON.stringify(payload) }),
  approveRoutePlan: (id: number) => request<any>(`${WMS_URL}/routes/${id}/approve`, { method: 'POST' }),
  transportLoad: (shipment_id: number) => request(`${WMS_URL}/transport/load`, { method: 'POST', body: JSON.stringify({ shipment_id }) }),
  transportUnload: (shipment_id: number) => request(`${WMS_URL}/transport/unload`, { method: 'POST', body: JSON.stringify({ shipment_id }) }),
  transportArrive: (shipment_id: number) => request(`${WMS_URL}/transport/arrive`, { method: 'POST', body: JSON.stringify({ shipment_id }) }),
  deliveryReady: (shipment_id: number) => request(`${WMS_URL}/delivery/ready`, { method: 'POST', body: JSON.stringify({ shipment_id }) }),
  deliveryConfirm: (shipment_id: number) => request(`${WMS_URL}/delivery/confirm`, { method: 'POST', body: JSON.stringify({ shipment_id }) }),

  fo3Report: () => request<{ total_amount: number; payments_count: number }>(`${FINANCE_URL}/accounting/fo-3`),
  auditLogs: () => request<any[]>(`${AUTH_URL}/audit/logs`),
  createPayment: (payload: { shipment_id: number; amount: number; method?: string }) =>
    request<any>(`${FINANCE_URL}/payments`, { method: 'POST', body: JSON.stringify(payload) }),
  updatePayment: (id: number, payload: { status: string }) =>
    request<any>(`${FINANCE_URL}/payments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};
