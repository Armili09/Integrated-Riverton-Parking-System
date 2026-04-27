import { useState } from 'react';
import api from '../api';

const violations = [
  { code: 'EXPIRED METER', label: 'Expired Meter', min: 30, max: 45 },
  { code: 'OVERTIME PARKING', label: 'Overtime Parking', min: 40, max: 55 },
  { code: 'STREET CLEANING', label: 'Street Cleaning', min: 60, max: 75 },
  { code: 'NO PERMIT', label: 'No Permit', min: 70, max: 90 },
  { code: 'NO PARKING ZONE', label: 'No Parking Zone', min: 90, max: 120 },
  { code: 'DOUBLE PARKING', label: 'Double Parking', min: 110, max: 140 },
  { code: 'FIRE HYDRANT', label: 'Fire Hydrant', min: 140, max: 180 },
  { code: 'HANDICAP ZONE', label: 'Handicap Zone', min: 200, max: 300 }
];

const IssueCitation = ({ license_number, officerName, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    violation_code: 'EXPIRED METER',
    fine_amount: '30',
    notes: '',
    evidence: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/officer/citation', {
        license_number,
        officer_name: officerName,
        violation_code: formData.violation_code,
        fine_amount: formData.fine_amount,
        notes: formData.notes
      });
      setSuccess(true);
    } catch (err) {
      alert("Error issuing citation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="var(--success)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--success)', marginBottom: '8px' }}>Citation Issued Successfully</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Ticket has been recorded for {license_number}</p>
            <button onClick={onSuccess} className="btn-primary" style={{ width: '100%' }}>Return to Dashboard</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--error)' }}>Issue Citation</h2>
            <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600, textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', letterSpacing: '2px', fontFamily: 'Outfit' }}>
              {license_number}
            </div>
            
            <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Violation Type</label>
          <select 
            className="input-field" 
            value={formData.violation_code}
            onChange={e => {
              const selectedV = violations.find(v => v.code === e.target.value);
              setFormData({
                ...formData, 
                violation_code: e.target.value,
                fine_amount: selectedV ? selectedV.min.toString() : ''
              });
            }}
          >
            {violations.map(v => (
              <option key={v.code} value={v.code}>{v.label} (${v.min}-${v.max})</option>
            ))}
          </select>

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Fine Amount ($)</label>
          <input 
            type="number" 
            className="input-field" 
            value={formData.fine_amount}
            min={violations.find(v => v.code === formData.violation_code)?.min}
            max={violations.find(v => v.code === formData.violation_code)?.max}
            onChange={e => setFormData({...formData, fine_amount: e.target.value})}
            required
          />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Officer Notes</label>
          <textarea 
            className="input-field" 
            rows="3"
            placeholder="Add details about the violation..."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          ></textarea>

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Evidence (Photo)</label>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px', cursor: 'pointer' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary)" style={{ margin: '0 auto 8px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tap to capture or upload photo</div>
            <input type="file" style={{ display: 'none' }} onChange={e => setFormData({...formData, evidence: e.target.files[0]})} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '14px', background: 'transparent', color: 'white', border: '1px solid var(--primary-dark)', borderRadius: '12px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" className="btn-error" style={{ flex: 1, padding: '14px' }} disabled={loading}>
              {loading ? 'Processing...' : 'Issue Ticket'}
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
};

export default IssueCitation;
