import { useState, useEffect } from 'react';
import api from '../api';

const OfficerCitations = ({ officer }) => {
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchCitations = async () => {
      try {
        const res = await api.get('/officer/citations');
        setCitations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCitations();
  }, []);

  if (loading) return <div className="screen-container">Loading tickets...</div>;

  const filteredCitations = citations.filter(c => {
    if (filter === 'All') return true;
    if (filter === 'Unpaid') return c.status.toUpperCase() === 'OPEN';
    return c.status.toUpperCase() === filter.toUpperCase();
  });

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Citation Feed</h1>
      
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingBottom: '12px', marginBottom: '12px' }}>
        {['All', 'Unpaid', 'Paid', 'Disputed'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '6px 16px', 
              borderRadius: '20px', 
              border: 'none', 
              background: filter === f ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredCitations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          No citations found.
        </div>
      ) : (
        filteredCitations.map(c => (
          <div 
            key={c.issue_number} 
            className="card" 
            style={{ marginBottom: '12px', cursor: 'pointer', border: expandedId === c.issue_number ? '1px solid var(--primary)' : 'none' }}
            onClick={() => setExpandedId(expandedId === c.issue_number ? null : c.issue_number)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '16px', color: 'white' }}>{c.violation_code.replace(/_/g, ' ')}</span>
              <span style={{ fontWeight: 700, color: 'var(--error)' }}>${c.fine_amount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <div>Plate: <span style={{ color: 'white', fontWeight: 600 }}>{c.license_number}</span></div>
              <div style={{
                color: c.status.toUpperCase() === 'OPEN' ? 'var(--error)' : c.status.toUpperCase() === 'PAID' ? 'var(--success)' : 'var(--warning)',
                fontWeight: 600
              }}>{c.status.toUpperCase() === 'OPEN' ? 'Unpaid' : c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase()}</div>
            </div>
            
            {expandedId === c.issue_number ? (
              <div className="animate-slide-up" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>TICKET NUMBER</div>
                    <div style={{ fontSize: '12px', color: 'white' }}>{c.issue_number}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>DATE & TIME</div>
                    <div style={{ fontSize: '12px', color: 'white' }}>{new Date(c.issue_datetime).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>ISSUED BY</div>
                    <div style={{ fontSize: '12px', color: 'white' }}>{c.officer_name || 'System'}</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>OFFICER NOTES</div>
                  <div style={{ fontSize: '12px', color: 'white', fontStyle: 'italic' }}>No additional notes provided for this citation.</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{new Date(c.issue_datetime).toLocaleDateString()}</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OfficerCitations;
