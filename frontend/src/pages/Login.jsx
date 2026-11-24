
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Login({ setUser }) {
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

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

      <button
        type="button"
        onClick={() => nav(-1)}
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

      <h2>Welcome Back</h2>

      {err && <div className="error">{err}</div>}

      <form onSubmit={submit}>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={change}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>

        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={change}
            placeholder="Enter your password"
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button className="btn" type="submit">
          Login
        </button>

      </form>

      <p className="switch">
        New here? <Link to="/signup">Create account</Link>
      </p>

    </div>
  );
}
