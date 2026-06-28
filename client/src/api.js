// Thin wrapper around fetch for talking to the API. In dev VITE_API_URL is
// empty and requests go through the Vite proxy; in production it points at the
// deployed backend.
const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body, keep the default message
    }
    throw new Error(message);
  }

  // 204 No Content (e.g. delete) has no body to parse.
  if (res.status === 204) return null;
  return res.json();
}

export const getSteps = () => request('/steps');
export const getReleases = () => request('/releases');
export const getRelease = (id) => request(`/releases/${id}`);

export const createRelease = (data) =>
  request('/releases', { method: 'POST', body: JSON.stringify(data) });

export const updateRelease = (id, data) =>
  request(`/releases/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteRelease = (id) =>
  request(`/releases/${id}`, { method: 'DELETE' });
