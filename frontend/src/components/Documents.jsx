const Documents = ({ navigate }) => {
  return (
    <div className="screen-container animate-fade-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', background: 'var(--background)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '50px 24px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <svg onClick={() => navigate('permits')} width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ cursor: 'pointer', marginRight: '16px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>My Documents</h1>
      </div>

      <div style={{ padding: '24px', flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          Manage the documents used to verify your identity, vehicle ownership, and residency for parking permits.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {[
            { tag: "Driver's License", status: 'Verified', date: 'Mar 15, 2026', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', color: '#166534', bg: '#dcfce7' },
            { tag: "Vehicle Registration", status: 'Verified', date: 'Mar 15, 2026', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#166534', bg: '#dcfce7' },
            { tag: "Proof of Residence", status: 'Needs Update', date: 'Expired Jan 10, 2026', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: '#b45309', bg: '#fef3c7' }
          ].map((doc, idx) => (
            <div key={idx} className="card" style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ background: 'rgba(29, 113, 242, 0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <svg width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{doc.tag}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{doc.date}</div>
              </div>
              <div style={{ background: doc.bg, color: doc.color, padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                {doc.status}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(29, 113, 242, 0.3)' }}>
          <svg width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload New Document
        </button>
      </div>
    </div>
  );
};

export default Documents;
