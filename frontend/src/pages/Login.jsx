// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Login({ setUser }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-box">
      <h2>Welcome Back</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={change} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={change} required />
        <button className="btn">Login</button>
      </form>
      <p className="switch">
        New here? <Link to="/signup">Create account</Link>
      </p>
    </div>
  );
}
