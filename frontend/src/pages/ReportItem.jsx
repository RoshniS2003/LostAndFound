// frontend/src/pages/ReportItem.jsx
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import api, { categories } from '../api.js';

export default function ReportItem() {
  const { type } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: categories[0],
    description: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [photo, setPhoto] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!['lost', 'found'].includes(type)) return <Navigate to="/" />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('type', type);
      if (photo) fd.append('photo', photo);
      const { data } = await api.post('/items', fd);
      nav(`/item/${data._id}`);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save item');
    }
    setBusy(false);
  };

  return (
    <div className="form-box">
      <h2>{type === 'lost' ? '😟 Report Lost Item' : '🙌 Report Found Item'}</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={change} placeholder="e.g. Black leather wallet" required />
        <label>Category</label>
        <select name="category" value={form.category} onChange={change}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={change} placeholder="Color, brand, marks, contents..." />
        <label>Location</label>
        <input name="location" value={form.location} onChange={change} placeholder="e.g. Library, Block B" required />
        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={change} required />
        <label>Photo (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
        <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Submit'}</button>
      </form>
    </div>
  );
}
