// Central place for every backend call. If your API base URL changes,
// update it here only.
const BASE_URL = "https://client-manager-api.vercel.app/api";
const TOKEN_KEY = "nexora_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,

    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty response body, that's fine
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong");
  }
  return data;
}

export const auth = {
  signup: (payload) =>
    request("/auth/signup", { method: "POST", body: payload, auth: false }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload, auth: false }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

export const clients = {
  list: () => request("/clients"),
  get: (id) => request(`/clients/${id}`),
  create: (payload) => request("/clients", { method: "POST", body: payload }),
  update: (id, payload) =>
    request(`/clients/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/clients/${id}`, { method: "DELETE" }),
};

// Only one notes endpoint was documented (POST /api/clients/notes), so this
// assumes it's scoped to a client via a clientId field/query param, and that
// a note has a `content` field. Adjust these three calls if your backend's
// notes routes end up shaped differently.
export const notes = {
  list: (clientId) => request(`/clients/notes?clientId=${clientId}`),
  create: (clientId, content) =>
    request("/clients/notes", { method: "POST", body: { clientId, content } }),
  remove: (noteId) => request(`/clients/notes/${noteId}`, { method: "DELETE" }),
};
