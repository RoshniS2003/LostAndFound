
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setErr('');
    setSuccess('');

    if (!name.trim()) {
      setErr('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setErr('Please enter your email');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setErr('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.put('/auth/profile', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      });

      // Save updated user information and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);

      setName(data.user.name || '');
      setEmail(data.user.email || '');
      setPhone(data.user.phone || '');

      setSuccess(data.message);

    } catch (e) {
      setErr(e.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">

  <button
  type="button"
  onClick={() => navigate(-1)}
  style={{
    background: 'none',
    border: 'none',
    padding: 0,
    color: '#000000',
    fontSize: '16px',
    fontWeight: '400',
    cursor: 'pointer',
    marginBottom: '20px'
  }}
>
  ← Back
</button>

      <h2>Edit Profile</h2>

      <p>
        Update your personal details and contact information.
      </p>

      {err && <div className="error">{err}</div>}

      {success && (
        <div className="success">
          {success}
        </div>
      )}

      <form onSubmit={submit}>

        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter 10-digit phone number"
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]{10}"
          required
        />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Save Changes'}
        </button>

      </form>
    </div>
  );
}
