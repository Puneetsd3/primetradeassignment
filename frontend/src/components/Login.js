// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.token);
      onAuth(res.token);
    } catch (e) {
      setErr(e.message || JSON.stringify(e));
    }
  };

  return (
    <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8,width:300}}>
      <h3>Login</h3>
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Login</button>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  );
}
