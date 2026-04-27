import { useState } from 'react';

const OfficerProfile = ({ officer, onLogout }) => {
  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Officer Profile</h1>

      <div className="card" style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--accent)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
          <svg width="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>{officer.name}</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>Badge: #{officer.id}</div>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>42</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Shift Citations</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>8.5h</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Shift Time</div>
          </div>
        </div>

        <button onClick={onLogout} className="btn-error" style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}>
          End Shift
        </button>
      </div>
      
      <div className="card">
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Division Settings</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span>Current Zone</span>
          <span style={{ fontWeight: 600 }}>Zone A (Downtown)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
          <span>Communication</span>
          <span style={{ fontWeight: 600, color: 'var(--success)' }}>Connected</span>
        </div>
      </div>
    </div>
  );
};

export default OfficerProfile;
