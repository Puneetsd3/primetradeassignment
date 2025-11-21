// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api';

export default function Dashboard({ token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [err, setErr] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await getNotes(token);
      setNotes(res);
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await createNote(token, { title, content });
      setTitle(''); setContent('');
      fetchNotes();
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  const doDelete = async (id) => {
    try { await deleteNote(token, id); fetchNotes(); } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  const doUpdate = async (id) => {
    const newTitle = prompt('New title');
    if (!newTitle) return;
    try { await updateNote(token, id, { title: newTitle }); fetchNotes(); } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  return (
    <div style={{padding:20}}>
      <h3>Dashboard</h3>
      <button onClick={() => { localStorage.removeItem('token'); onLogout(); }}>Logout</button>

      <form onSubmit={add} style={{marginTop:12, marginBottom:12, display:'flex', gap:8}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
        <button type="submit">Add Note</button>
      </form>

      {err && <div style={{color:'red'}}>{err}</div>}

      <ul>
        {notes.map(n => (
          <li key={n.id} style={{marginBottom:8}}>
            <b>{n.title}</b> — {n.content}
            <button style={{marginLeft:8}} onClick={()=>doUpdate(n.id)}>Edit</button>
            <button style={{marginLeft:8}} onClick={()=>doDelete(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
