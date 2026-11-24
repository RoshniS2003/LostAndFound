
// frontend/src/App.jsx

import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ReportItem from './pages/ReportItem.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import MyItems from './pages/MyItems.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const guard = (page) =>
    user ? page : <Navigate to="/login" />;

  return (
    <BrowserRouter>

      <nav className="navbar">

        <Link to="/" className="logo">
          🔎 Lost &amp; Found
        </Link>

        <div className="links">

          <Link to="/">Home</Link>

          {user ? (
            <>
              <Link to="/report/lost">Report Lost</Link>

              <Link to="/report/found">Report Found</Link>

              <Link to="/my">My Items</Link>

              <Link to="/profile">Edit Profile</Link>

              <span className="hello">
                Hi, {user.name} ({user.role})
              </span>

              <button
                className="btn ghost small"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link to="/signup" className="btn small">
                Sign Up
              </Link>
            </>
          )}

        </div>
      </nav>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        <Route
          path="/signup"
          element={<Signup setUser={setUser} />}
        />

        <Route
          path="/report/:type"
          element={guard(<ReportItem />)}
        />

        <Route
          path="/my"
          element={guard(<MyItems />)}
        />

        <Route
          path="/item/:id"
          element={guard(<ItemDetail user={user} />)}
        />

        <Route
          path="/profile"
          element={guard(
            <Profile user={user} setUser={setUser} />
          )}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}
