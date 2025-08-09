import { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import api from './api/axios';

function Section({ title, children }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

function App() {
  const [schema, setSchema] = useState(null);
  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState(null);

  const [registerForm, setRegisterForm] = useState({ email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetRequestForm, setResetRequestForm] = useState({ email: '' });
  const [resetForm, setResetForm] = useState({ email: '', code: '', newPassword: '' });

  useEffect(() => {
    // Load API schema from backend as required
    fetch('/api/schema')
      .then((r) => r.text())
      .then((text) => setSchema(text))
      .catch((e) => console.error('Schema load error', e));
  }, []);

  function addMsg(msg) {
    setMessages((prev) => [{ id: Date.now(), text: JSON.stringify(msg, null, 2) }, ...prev].slice(0, 10));
  }

  async function onRegister(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/register', registerForm);
      localStorage.setItem('token', data.token);
      addMsg({ scope: 'register', data });
    } catch (error) {
      addMsg({ scope: 'register:error', error: error.response?.data || error.message });
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/login', loginForm);
      localStorage.setItem('token', data.token);
      addMsg({ scope: 'login', data });
    } catch (error) {
      addMsg({ scope: 'login:error', error: error.response?.data || error.message });
    }
  }

  async function onMe() {
    try {
      const { data } = await api.get('/api/auth/me');
      setMe(data.user);
      addMsg({ scope: 'me', data });
    } catch (error) {
      addMsg({ scope: 'me:error', error: error.response?.data || error.message });
    }
  }

  async function onRequestReset(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/request-reset', resetRequestForm);
      addMsg({ scope: 'request-reset', data });
    } catch (error) {
      addMsg({ scope: 'request-reset:error', error: error.response?.data || error.message });
    }
  }

  async function onResetPassword(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/reset-password', resetForm);
      addMsg({ scope: 'reset-password', data });
    } catch (error) {
      addMsg({ scope: 'reset-password:error', error: error.response?.data || error.message });
    }
  }

  return (
    <ErrorBoundary>
      <div className="App" style={{ maxWidth: 800, margin: '0 auto', padding: 16, textAlign: 'left' }}>
        <h2>Easyappz: Auth Demo</h2>

        <Section title="API Schema (read-only)">
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto', background: '#f8fafc', padding: 12 }}>
            {schema || 'Loading /api/schema...'}
          </pre>
        </Section>

        <Section title="Register">
          <form onSubmit={onRegister}>
            <input
              placeholder="Email"
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <input
              placeholder="Password"
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Register</button>
          </form>
        </Section>

        <Section title="Login">
          <form onSubmit={onLogin}>
            <input
              placeholder="Email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <input
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Login</button>
          </form>
        </Section>

        <Section title="Profile">
          <button onClick={onMe}>Load My Profile</button>
          {me && (
            <pre style={{ whiteSpace: 'pre-wrap', background: '#f1f5f9', padding: 12, marginTop: 12 }}>{JSON.stringify(me, null, 2)}</pre>
          )}
        </Section>

        <Section title="Request Password Reset Code">
          <form onSubmit={onRequestReset}>
            <input
              placeholder="Email"
              type="email"
              value={resetRequestForm.email}
              onChange={(e) => setResetRequestForm({ ...resetRequestForm, email: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Request Code</button>
          </form>
        </Section>

        <Section title="Reset Password">
          <form onSubmit={onResetPassword}>
            <input
              placeholder="Email"
              type="email"
              value={resetForm.email}
              onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <input
              placeholder="Code"
              type="text"
              value={resetForm.code}
              onChange={(e) => setResetForm({ ...resetForm, code: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <input
              placeholder="New Password"
              type="password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Reset Password</button>
          </form>
        </Section>

        <Section title="Logs (last 10)">
          <div style={{ maxHeight: 200, overflow: 'auto', background: '#f8fafc', padding: 12 }}>
            {messages.map((m) => (
              <pre key={m.id} style={{ whiteSpace: 'pre-wrap' }}>{m.text}</pre>
            ))}
          </div>
        </Section>
      </div>
    </ErrorBoundary>
  );
}

export default App;
