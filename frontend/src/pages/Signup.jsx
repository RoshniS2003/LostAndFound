
// frontend/src/pages/Signup.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Signup({ setUser }) {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    staffCode: ''
  });

  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    // Check 10-digit phone number
    if (!/^[0-9]{10}$/.test(form.phone)) {
      setErr('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const { data } = await api.post('/auth/signup', form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Signup failed');
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
      
      <h2>Create Account</h2>

      {err && <div className="error">{err}</div>}

      <form onSubmit={submit}>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={change}
          placeholder="Enter your full name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={change}
          placeholder="Enter your email"
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={change}
          placeholder="Enter 10-digit phone number"
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]{10}"
          title="Enter a valid 10-digit phone number"
          required
        />

        <label>Password (min 6 characters)</label>

        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={change}
            placeholder="Enter your password"
            minLength={6}
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

        <label>I am a</label>
        <select
          name="role"
          value={form.role}
          onChange={change}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin / Security</option>
        </select>

        {form.role !== 'student' && (
          <>
            <label>Staff Code</label>
            <input
              type="text"
              name="staffCode"
              value={form.staffCode}
              onChange={change}
              placeholder="Enter staff code"
              required
            />
          </>
        )}

        <button className="btn" type="submit">
          Sign Up
        </button>

      </form>

      <p className="switch">
        Already registered? <Link to="/login">Login</Link>
      </p>

    </div>
  );
}
