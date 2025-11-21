// src/App.js
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

export default App;
