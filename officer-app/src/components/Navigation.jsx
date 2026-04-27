const Navigation = ({ currentScreen, onNavigate }) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'citations',
      label: 'Citations',
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '12px 0 24px',
      background: 'var(--surface)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%'
    }}>
      {tabs.map(tab => {
        const isActive = currentScreen === tab.id;
        return (
          <div 
            key={tab.id} 
            onClick={() => onNavigate(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: '0.2s',
              transform: isActive ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div style={{ color: isActive ? 'var(--accent)' : 'inherit', marginBottom: '4px' }}>
              {tab.icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;
