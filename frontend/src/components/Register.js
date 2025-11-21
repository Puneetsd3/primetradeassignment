// src/components/Register.js
/*import React, { useState } from 'react';
import { register } from '../api';

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await register(form);
      localStorage.setItem('token', res.token);
      onAuth(res.token);
    } catch (e) {
      setErr(e.message || JSON.stringify(e));
    }
  };

  return (
    <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8,width:300}}>
      <h3>Register</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Register</button>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  );
}*/

import React, { useState } from 'react';
import { register } from '../api';

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await register(form);
      localStorage.setItem('token', res.token);
      onAuth(res.token, res.user?.name);
    } catch (e) {
      setErr(e.message || (e && e.errors && e.errors[0]?.msg) || JSON.stringify(e));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h3>Register</h3>
      <form onSubmit={submit} className="form-row column">
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
          <button type="button" className="btn btn-ghost" onClick={()=>setForm({name:'',email:'',password:''})}>Clear</button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
