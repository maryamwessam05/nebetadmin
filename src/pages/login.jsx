import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./dashboard.css"
import logo from "../assets/sidelogo.svg"

const USERS = [
  { email: "alaa@admin.com", password: "123456", role: "admin" },
  { email: "jamila@gmail.com", password: "4588", role: "user" },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const match = USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!match) {
      setError('No account found');
      return;
    }

    setError('');

    if (match.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/noaccess');
    }
  };

  return (
    <>
      <div className="logcont">
        <img src={logo} alt="" />
        <div className="logincontainer">
          <div className="welc">
            <h1>Welcome Back</h1>
            <p>Sign in to access the admin dashboard</p>
          </div>
          <div className="line"></div>
          <div className="group">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              placeholder='admin@nebet.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '14px', margin: '0' , fontFamily: "Darker Grotesque"}}>{error}</p>}
          <div className="line"></div>
          <button className="login" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </>
  );
}

export default Login;