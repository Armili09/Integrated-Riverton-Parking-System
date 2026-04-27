import { useState } from 'react';
import Auth from './components/Auth';
import Lookup from './components/Lookup';
import OfficerCitations from './components/OfficerCitations';
import OfficerProfile from './components/OfficerProfile';
import Navigation from './components/Navigation';

function App() {
  const [officer, setOfficer] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Lookup officer={officer} onNavigate={setCurrentScreen} />;
      case 'citations':
        return <OfficerCitations officer={officer} />;
      case 'profile':
        return <OfficerProfile officer={officer} onLogout={() => setOfficer(null)} />;
      default:
        return <Lookup officer={officer} />;
    }
  };

  return (
    <>
      {!officer ? (
        <Auth onLogin={(user) => { setOfficer(user); setCurrentScreen('home'); }} />
      ) : (
        <>
          {renderScreen()}
          <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        </>
      )}
    </>
  );
}

export default App;
