
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
  const [actionErr, setActionErr] = useState('');
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    setItem(null);
    setErr('');

    api.get(`/items/${id}`)
      .then((r) => setItem(r.data))
      .catch((e) =>
        setErr(e.response?.data?.message || 'Error')
      );

    api.get(`/items/${id}/matches`)
      .then((r) => setMatches(r.data))
      .catch(() => setMatches([]));

  }, [id]);

  // Faculty approves or removes verification
  const approve = async () => {
    try {
      setApproving(true);
      setActionErr('');

      const { data } = await api.put(`/items/${id}/approve`);

      setItem((prev) => ({
        ...prev,
        isApproved: data.item.isApproved
      }));

    } catch (e) {
      setActionErr(
        e.response?.data?.message || 'Approval failed'
      );
    } finally {
      setApproving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this item?')) return;

    try {
      await api.delete(`/items/${id}`);
      nav('/');
    } catch (e) {
      setActionErr(
        e.response?.data?.message || 'Delete failed'
      );
    }
  };

  if (err) return <p className="container empty">{err}</p>;

  if (!item) return <p className="container empty">Loading...</p>;

  // Only faculty can approve reports
  const canApprove = user?.role === 'faculty';

  const canDelete =
    user?.role === 'admin' || item.user?._id === user?.id;

  const ownerPhone = item.user?.phone;

  return (
    <div className="container">

      {/* Back Button */}
      <button
  type="button"
  onClick={() => nav(-1)}
  style={{
    marginBottom: '20px',
    padding: '0',
    background: 'none',
    border: 'none',
    color: '#111111',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }}
>
  ← Back
</button>

      <div className="detail">

        {item.photo ? (
          <img src={item.photo} alt={item.title} />
        ) : (
          <div className="noimg">📦</div>
        )}

        <div className="info">

          <div className="badges">
            <span className={`badge ${item.type}`}>
              {item.type.toUpperCase()}
            </span>

            <span className={`badge ${item.isApproved ? 'approved' : 'pending'}`}>
              {item.isApproved ? '✔ Approved' : 'Pending'}
            </span>
          </div>

          <h1>{item.title}</h1>

          <p>
            <b>Category:</b> {item.category}
          </p>

          <p>
            <b>Location:</b> 📍 {item.location}
          </p>

          <p>
            <b>Date:</b> 📅 {new Date(item.date).toLocaleDateString()}
          </p>

          <div className="desc">
            {item.description || 'No description given.'}
          </div>

          <p>
            <b>Posted by:</b> {item.user?.name}
          </p>

          <p>
            <b>Contact:</b> {ownerPhone || 'Phone number not available'}
          </p>

          {ownerPhone && (
            <a
              href={`tel:${ownerPhone}`}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                marginBottom: '15px',
                boxShadow: '0 3px 10px rgba(139, 92, 246, 0.25)'
              }}
            >
              📞 Call Owner
            </a>
          )}

          {actionErr && (
            <p className="error">{actionErr}</p>
          )}

          <div className="row">

            {canApprove && (
              <button
                className={`btn ${item.isApproved ? '' : 'success'}`}
                onClick={approve}
                disabled={approving}
              >
                {approving
                  ? 'Updating...'
                  : item.isApproved
                    ? 'Unapprove'
                    : 'Approve'}
              </button>
            )}

            {canDelete && (
              <button
                className="btn danger"
                onClick={remove}
              >
                Delete
              </button>
            )}

          </div>

        </div>
      </div>

      <h2 className="section-title">
        Possible Matches
        <span className="ai-tag">AI Smart Match</span>
      </h2>

      <p className="muted" style={{ marginBottom: 16 }}>
        Compared with all {item.type === 'lost' ? 'found' : 'lost'} items using title + description.
      </p>

      {matches.length === 0 ? (
        <p className="empty">
          No matches yet. Check back later!
        </p>
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
