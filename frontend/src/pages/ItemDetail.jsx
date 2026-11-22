// frontend/src/pages/ItemDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';
import { ItemCard } from './Home.jsx';

export default function ItemDetail({ user }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    setItem(null);
    setErr('');
    api.get(`/items/${id}`).then((r) => setItem(r.data)).catch((e) => setErr(e.response?.data?.message || 'Error'));
    api.get(`/items/${id}/matches`).then((r) => setMatches(r.data)).catch(() => setMatches([]));
  }, [id]);

  const approve = async () => {
    const { data } = await api.put(`/items/${id}/approve`);
    setItem({ ...item, isApproved: data.isApproved });
  };

  const remove = async () => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/items/${id}`);
    nav('/');
  };

  if (err) return <p className="container empty">{err}</p>;
  if (!item) return <p className="container empty">Loading...</p>;

  const canApprove = ['admin', 'faculty'].includes(user.role);
  const canDelete = user.role === 'admin' || item.user?._id === user.id;

  return (
    <div className="container">
      <div className="detail">
        {item.photo ? <img src={item.photo} alt={item.title} /> : <div className="noimg">📦</div>}
        <div className="info">
          <div className="badges">
            <span className={`badge ${item.type}`}>{item.type.toUpperCase()}</span>
            <span className={`badge ${item.isApproved ? 'approved' : 'pending'}`}>
              {item.isApproved ? '✔ Approved' : 'Pending'}
            </span>
          </div>
          <h1>{item.title}</h1>
          <p><b>Category:</b> {item.category}</p>
          <p><b>Location:</b> 📍 {item.location}</p>
          <p><b>Date:</b> 📅 {new Date(item.date).toLocaleDateString()}</p>
          <div className="desc">{item.description || 'No description given.'}</div>
          <p><b>Posted by:</b> {item.user?.name}</p>
          <p><b>Contact:</b> {item.user?.email}</p>
          <div className="row">
            {canApprove && (
              <button className={`btn ${item.isApproved ? '' : 'success'}`} onClick={approve}>
                {item.isApproved ? 'Unapprove' : 'Approve'}
              </button>
            )}
            {canDelete && <button className="btn danger" onClick={remove}>Delete</button>}
          </div>
        </div>
      </div>

      <h2 className="section-title">
        Possible Matches<span className="ai-tag">AI Smart Match</span>
      </h2>
      <p className="muted" style={{ marginBottom: 16 }}>
        Compared with all {item.type === 'lost' ? 'found' : 'lost'} items using title + description.
      </p>
      {matches.length === 0 ? (
        <p className="empty">No matches yet. Check back later!</p>
      ) : (
        <div className="grid">
          {matches.map((m) => (
            <ItemCard key={m._id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
}
