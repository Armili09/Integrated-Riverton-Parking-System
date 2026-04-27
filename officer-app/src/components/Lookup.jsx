import { useState } from 'react';
import api from '../api';
import IssueCitation from './IssueCitation';

const Lookup = ({ officer, onLogout }) => {
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [showManualLookup, setShowManualLookup] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!plate) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/officer/lookup/${plate.toUpperCase()}`);
      setResult(res.data);
    } catch (err) {
      alert("Search failed. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const reloadData = async () => {
    try {
      const res = await api.get(`/officer/lookup/${plate.toUpperCase()}`);
      setResult(res.data);
    } catch (err) {}
  };

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '100px' }}>
      {/* Header - Reference Design */}
      {!result && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          <h1 style={{ fontSize: '20px', color: 'white', fontWeight: 700, margin: 0, fontFamily: 'Inter' }}>City of Riverton</h1>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '1px' }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }}></div>
            SYNCED
          </div>
        </div>
      )}

      {result && (
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: 'white' }}>Lookup Result</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vehicle Details</div>
          </div>
          <button onClick={() => setResult(null)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Close</button>
        </div>
      )}

      {/* Search Module / Home Dashboard */}
      <div>
        {!result && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', color: 'white', fontWeight: 800, lineHeight: 1.2, marginBottom: '8px', fontFamily: 'Inter' }}>
                Welcome, Officer<br/>{officer?.name ? officer.name.split(' ')[0] : 'Marcus'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Shift: Day Shift (08:00 - 16:00)
              </div>
            </div>

            {/* Scan Plate Card */}
            <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary-dark) 100%)', borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => alert('Scan Plate feature coming soon!')}>
              <div style={{ position: 'absolute', right: '-20px', top: '20px', opacity: 0.1 }}>
                <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 2h6v2H9V8zm0 4h6v2H9v-2z" /></svg>
              </div>
              <div style={{ background: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px', fontFamily: 'Inter' }}>Scan Plate</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Auto-detect vehicle records</p>
            </div>

            {/* Action Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
              <div 
                style={{ background: 'var(--surface)', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.05)' }}
                onClick={() => setShowManualLookup(!showManualLookup)}
              >
                <div style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>Manual Lookup</div>
              </div>
            </div>
          </>
        )}

        {(showManualLookup || result) && (
          <div className="animate-fade-in" style={{ background: !result ? 'var(--surface)' : 'transparent', padding: !result ? '16px' : '0', borderRadius: '16px', border: !result ? '1px solid rgba(255,255,255,0.05)' : 'none', marginBottom: '24px' }}>
            <form onSubmit={handleSearch}>
              {!result && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Enter Plate Number</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ margin: 0, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--primary-dark)' }}
                  placeholder="PLATE NUMBER"
                  value={plate}
                  onChange={e => setPlate(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ width: '60px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--accent)' }} disabled={loading}>
                  <svg width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>Running query...</div>}

        {!result && !loading && (
          <div className="animate-fade-in" style={{ marginTop: '0' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Patrol</h3>
            
            <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--surface) 0%, var(--secondary) 100%)', color: 'white', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>CURRENT ZONE</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Downtown North</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', width: '48px', height: '48px', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ textAlign: 'center', padding: '20px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Outfit' }}>42</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>PLATES SCANNED</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '20px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--error)', fontFamily: 'Outfit' }}>6</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>CITATIONS ISSUED</div>
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="animate-slide-up" style={{ marginTop: '0' }}>
            {/* Logic Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div className={`badge ${
                result.status === 'VALID' ? 'badge-valid' : 
                result.status === 'NO_PERMIT' ? 'badge-no-permit' : 'badge-expired'
              }`}>
                {result.status.replace('_', ' ')}
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                {result.citations.length} PAST TICKETS
              </div>
            </div>

            {/* Core Card */}
            <div className="card">
              <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vehicle Info</h3>
              <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', letterSpacing: '1px', marginBottom: '8px' }}>
                {plate.toUpperCase()}
              </div>

              {result.vehicle ? (
                <>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>{result.vehicle.state} • {result.vehicle.type}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>MAKE</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{result.vehicle.make || 'Toyota'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>MODEL</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{result.vehicle.model || 'Camry'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>COLOR</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{result.vehicle.color || 'Silver'}</div>
                    </div>
                  </div>
                  
                  {result.owner && (
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>REGISTERED OWNER</div>
                      <div style={{ fontWeight: 600 }}>{result.owner.name}</div>
                    </div>
                  )}

                  {result.permit ? (
                    <div style={{ borderLeft: `3px solid ${result.status === 'VALID' ? 'var(--success)' : 'var(--warning)'}`, paddingLeft: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>PERMIT: {result.permit.permit_id}</div>
                      <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{result.permit.type} ({result.permit.status})</span>
                        <span style={{ fontSize: '12px', color: 'var(--accent)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                          ZONE: {result.permit.zone || 'North'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Validity: {new Date(result.permit.expiry).toLocaleDateString()}</div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No permits attached to this vehicle.</div>
                  )}
                </>
              ) : (
                <div style={{ color: 'var(--warning)', marginTop: '8px' }}>
                  No vehicle registered in city database.
                </div>
              )}
            </div>

            {/* Action Box */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ textAlign: 'center', background: result.recommendation === 'ISSUE_CITATION' ? 'transparent' : 'rgba(16, 185, 129, 0.1)', border: result.recommendation === 'ISSUE_CITATION' ? 'none' : '1px dashed var(--success)', padding: result.recommendation === 'ISSUE_CITATION' ? '0' : '16px', borderRadius: '12px', marginBottom: '16px' }}>
                {result.recommendation === 'ISSUE_CITATION' ? (
                  <p style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>CITATION RECOMMENDED</p>
                ) : (
                  <>
                    <p style={{ color: 'var(--success)', fontWeight: 600 }}>Valid Permit Found</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Citation not recommended, but optional.</p>
                  </>
                )}
              </div>
              <button onClick={() => setShowCitationModal(true)} className={result.recommendation === 'ISSUE_CITATION' ? "btn-error" : "btn-primary"} style={{ width: '100%', background: result.recommendation !== 'ISSUE_CITATION' ? 'rgba(255,255,255,0.1)' : undefined }}>
                Issue Citation
              </button>
            </div>
            
            {/* Past Citations List (mini) */}
            {result.citations.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Citation History</h3>
                {result.citations.slice(0, 3).map(c => (
                  <div key={c.issue_number} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.violation_code}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(c.issue_datetime).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: c.status === 'Unpaid' ? 'var(--error)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '14px' }}>{c.status}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>${c.fine_amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showCitationModal && (
        <IssueCitation 
          license_number={plate.toUpperCase()} 
          officerName={officer?.name || 'Marcus'}
          onClose={() => setShowCitationModal(false)}
          onSuccess={() => {
            setShowCitationModal(false);
            if (onNavigate) {
              onNavigate('citations');
            } else {
              reloadData();
            }
          }}
        />
      )}
    </div>
  );
};

export default Lookup;
