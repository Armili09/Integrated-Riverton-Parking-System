import { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded simulation for the mockup
    if (badgeId === '123' && password === 'admin') {
      onLogin({ id: 'OFC-001', name: 'Officer Gordon' });
    } else {
      alert("Invalid credentials. Try Badge: 123, Password: admin");
    }
  };

  return (
    <div className="screen-container animate-fade-in" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ background: 'var(--accent)', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
          <svg width="32" color="white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h1 style={{ fontSize: '28px' }}>Enforcement Portal</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Riverton Parking Authority</p>
      </div>

      <form onSubmit={handleLogin} className="card">
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Badge ID</label>
        <input 
          type="text" 
          className="input-field" 
          value={badgeId}
          onChange={e => setBadgeId(e.target.value)}
          placeholder="Enter 123"
          required 
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>PIN Code</label>
        <input 
          type="password" 
          className="input-field" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin"
          required 
        />

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Authenticate</button>
      </form>
    </div>
  );
};

export default Auth;
