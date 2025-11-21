/*// src/App.js
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  if (!token) {
    return (
      <div style={{padding:20}}>
        <h2>Intern Assignment Demo</h2>
        <div style={{display:'flex', gap:20}}>
          <div><Register onAuth={(t)=>setToken(t)} /></div>
          <div><Login onAuth={(t)=>setToken(t)} /></div>
        </div>
      </div>
    );
  }

  return <Dashboard token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null); }} />;
}

export default App;*/

import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    // optionally decode user from token if needed (or call /me)
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>Intern Assignment Demo</h1>
        {token ? <div style={{color:'#374151'}}>Signed in as <b style={{marginLeft:8}}>{userName || 'User'}</b></div> : <div className="hint">Build: Node/Express · Postgres · JWT</div>}
      </div>

      {!token ? (
        <div className="grid">
          <div className="card">
            <Register onAuth={(t, name)=>{ localStorage.setItem('token', t); setToken(t); setUserName(name); }} />
          </div>
          <div className="card">
            <Login onAuth={(t, name)=>{ localStorage.setItem('token', t); setToken(t); setUserName(name); }} />
          </div>
        </div>
      ) : (
        <div className="card">
          <Dashboard token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null); setUserName(null); }} />
        </div>
      )}
    </div>
  );
}

export default App;

