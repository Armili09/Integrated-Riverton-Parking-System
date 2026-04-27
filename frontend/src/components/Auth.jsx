import { useState } from 'react';
import api from '../api';

const Auth = ({ type, onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'login') {
        const res = await api.post('/users/login', { email, password });
        if (res.data.success) {
          onSuccess(res.data.user);
        }
      } else {
        const res = await api.post('/users', { name, email, password });
        if (res.data.success) {
          onSuccess(res.data.user);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container animate-fade-in" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', color: 'var(--primary)' }}>
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          {type === 'login' ? 'Enter your details to sign in' : 'Sign up to manage your parking'}
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--error)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {type === 'signup' && (
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Peter Parker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input 
            type="email" 
            className="input-field" 
            placeholder="peter@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input 
            type="password" 
            className="input-field" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
          {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => onSwitch(type === 'login' ? 'signup' : 'login')}
        >
          {type === 'login' ? "Sign Up" : "Sign In"}
        </span>
      </div>
    </div>
  );
};

export default Auth;
