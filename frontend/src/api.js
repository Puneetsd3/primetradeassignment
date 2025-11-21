// src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/v1';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = text; }
  if (!res.ok) throw data;
  return data;
}

export const register = (payload) => request('/auth/register', { method: 'POST', body: payload });
export const login = (payload) => request('/auth/login', { method: 'POST', body: payload });
export const getNotes = (token) => request('/notes', { token });
export const createNote = (token, payload) => request('/notes', { method: 'POST', token, body: payload });
export const updateNote = (token, id, payload) => request(`/notes/${id}`, { method: 'PUT', token, body: payload });
export const deleteNote = (token, id) => request(`/notes/${id}`, { method: 'DELETE', token });
