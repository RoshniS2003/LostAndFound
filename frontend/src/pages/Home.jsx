// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { categories } from '../api.js';

export function ItemCard({ item, onDelete }) {
  return (
    <div className="card">
      <Link to={`/item/${item._id}`}>
        {item.photo ? <img src={item.photo} alt={item.title} /> : <div className="noimg">📦</div>}
      </Link>
      <div className="card-body">
        <div className="badges">
          <span className={`badge ${item.type}`}>{item.type.toUpperCase()}</span>
          <span className={`badge ${item.isApproved ? 'approved' : 'pending'}`}>
            {item.isApproved ? '✔ Approved' : 'Pending'}
          </span>
          {item.match !== undefined && <span className="badge match">{item.match}% match</span>}
        </div>
        <h3>{item.title}</h3>
        <p className="muted">📍 {item.location}</p>
        <p className="muted">
          📅 {new Date(item.date).toLocaleDateString()} · {item.category}
        </p>
        <div className="row">
          <Link className="btn small" to={`/item/${item._id}`}>View</Link>
          {onDelete && (
            <button className="btn danger small" onClick={() => onDelete(item._id)}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      api
        .get('/items', { params: { q, type, category } })
        .then((r) => setItems(r.data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [q, type, category]);

  return (
    <>
      <div className="hero">
        <h1>Lost &amp; Found Network</h1>
        <p>Find your lost belongings on campus - no more WhatsApp group chaos.</p>
      </div>
      <div className="container">
        <div className="filters">
          <input placeholder="Search by title, description or location..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Lost + Found</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="empty">Loading...</p>
        ) : items.length === 0 ? (
          <p className="empty">No items found.</p>
        ) : (
          <div className="grid">
            {items.map((i) => (
              <ItemCard key={i._id} item={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
