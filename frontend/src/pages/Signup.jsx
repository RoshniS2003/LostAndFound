// frontend/src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Signup({ setUser }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', staffCode: '' });
  const [err, setErr] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
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
      <h2>Create Account</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={change} required />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={change} required />
        <label>Password (min 6 characters)</label>
        <input type="password" name="password" value={form.password} onChange={change} minLength={6} required />
        <label>I am a</label>
        <select name="role" value={form.role} onChange={change}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin / Security</option>
        </select>
        {form.role !== 'student' && (
          <>
            <label>Staff Code</label>
            <input name="staffCode" value={form.staffCode} onChange={change} required />
          </>
        )}
        <button className="btn">Sign Up</button>
      </form>
      <p className="switch">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
