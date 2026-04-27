import { useState } from 'react';

const Onboarding = ({ onComplete }) => {
  const [slide, setSlide] = useState(1);

  const slides = [
    {
      id: 1,
      title: "Easy Parking Management",
      desc: "Apply for parking permits, manage multiple vehicles, and track your applications all in one place.",
      iconBg: "#4aa9ff",
      icon: <svg width="56" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l2-4h10l2 4M5 10v8a2 2 0 002 2h2a2 2 0 002-2v-1h2v1a2 2 0 002 2h2a2 2 0 002-2v-8M5 10h14M8 14h.01M16 14h.01" /></svg>
    },
    {
      id: 2,
      title: "Streamlined Payments",
      desc: "Instantly view your outstanding balances and pay violation fines or permit renewal fees securely.",
      iconBg: "#6a7dff",
      icon: <svg width="56" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    },
    {
      id: 3,
      title: "Find Parking Zones",
      desc: "Discover available parking zones near you with real-time availability and detailed restrictions.",
      iconBg: "#b56fff",
      icon: <svg width="56" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }
  ];

  const current = slides.find(s => s.id === slide);

  const nextSlide = () => {
    if (slide < 3) setSlide(slide + 1);
    else onComplete();
  };

  return (
    <div className="screen-container animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to bottom, #1d71f2, #a644ff)', color: 'white', minHeight: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px' }}>
        <button onClick={onComplete} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
          Skip
        </button>
      </div>
      
      {/* Icon Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ 
          width: '140px', height: '140px', 
          background: current.iconBg, 
          borderRadius: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '60px'
        }}>
          {current.icon}
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '20px', textAlign: 'center', letterSpacing: '-0.5px' }}>
          {current.title}
        </h1>
        <p style={{ fontSize: '16px', lineHeight: 1.5, textAlign: 'center', opacity: 0.9, padding: '0 12px' }}>
          {current.desc}
        </p>
      </div>

      {/* Footer Area */}
      <div style={{ paddingBottom: '30px' }}>
        {/* Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '8px' }}>
          {slides.map(s => (
            <div key={s.id} style={{
              height: '8px',
              width: slide === s.id ? '24px' : '8px',
              borderRadius: '4px',
              background: slide === s.id ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
        
        {/* Action Button */}
        <button 
          onClick={nextSlide}
          className="btn-primary"
          style={{
            background: 'white', color: '#1d71f2',
            padding: '20px', borderRadius: '16px',
            width: '100%', fontSize: '20px', fontWeight: 600,
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {slide === 3 ? "Get Started" : "Next"} 
          <svg width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
