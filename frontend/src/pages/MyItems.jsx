// frontend/src/pages/MyItems.jsx
import { useEffect, useState } from 'react';
import api from '../api.js';
import { ItemCard } from './Home.jsx';

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/items/mine').then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/items/${id}`);
    setItems(items.filter((i) => i._id !== id));
  };

  return (
    <div className="container">
      <h2 className="section-title">My Items</h2>
      {loading ? (
        <p className="empty">Loading...</p>
      ) : items.length === 0 ? (
        <p className="empty">You have not reported anything yet.</p>
      ) : (
        <div className="grid">
          {items.map((i) => (
            <ItemCard key={i._id} item={i} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
