import { useState, useEffect } from "react";
import { ToastProvider } from "./components/toast/ToastProvider";
import { useToast } from "./components/toast/useToast";
import { setupApiInterceptors } from "./api";
import Onboarding from "./components/Onboarding";
import Auth from "./components/Auth";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Permits from "./components/Permits";
import Vehicles from "./components/Vehicles";
import Citations from "./components/Citations";
import Profile from "./components/Profile";
import Payments from "./components/Payments";
import Disputes from "./components/Disputes";
import Documents from "./components/Documents";
import PaymentMethods from "./components/PaymentMethods";
import PayBalance from "./components/PayBalance";
import PermitDetails from "./components/PermitDetails";
import Renew from "./components/Renew";

function AppInner() {
  const toast = useToast();
  const [currentScreen, setCurrentScreen] = useState("onboarding");
  const [screenParams, setScreenParams] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    setupApiInterceptors(toast);
  }, [toast]);

  const navigate = (screen = null, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("login");
  };

  const isDashboardScreen = ["home", "permits", "profile"].includes(
    currentScreen,
  );

  return (
    <>
      {currentScreen === "onboarding" && (
        <Onboarding onComplete={() => navigate("login")} />
      )}

      {(currentScreen === "login" || currentScreen === "signup") && (
        <Auth
          type={currentScreen}
          onSwitch={(type) => navigate(type)}
          onSuccess={handleLogin}
        />
      )}

      {user && currentScreen === "home" && (
        <Home user={user} navigate={navigate} />
      )}
      {user && currentScreen === "permits" && (
        <Permits user={user} navigate={navigate} />
      )}
      {user && currentScreen === "vehicles" && (
        <Vehicles user={user} navigate={navigate} />
      )}
      {user && currentScreen === "citations" && (
        <Citations user={user} navigate={navigate} />
      )}
      {user && currentScreen === "profile" && (
        <Profile user={user} navigate={navigate} onLogout={handleLogout} />
      )}
      {user && currentScreen === "payments" && (
        <Payments user={user} navigate={navigate} />
      )}
      {user && currentScreen === "disputes" && (
        <Disputes user={user} navigate={navigate} />
      )}
      {user && currentScreen === "documents" && (
        <Documents navigate={navigate} />
      )}
      {user && currentScreen === "paymentMethods" && (
        <PaymentMethods navigate={navigate} from={screenParams.from} />
      )}
      {user && currentScreen === "payBalance" && (
        <PayBalance
          user={user}
          navigate={navigate}
          permitFees={screenParams.permitFees}
          unpaidFines={screenParams.unpaidFines}
          total={screenParams.total}
          unpaidCitations={screenParams.unpaidCitations}
        />
      )}
      {user && currentScreen === "permitDetails" && (
        <PermitDetails navigate={navigate} permit={screenParams.permit} />
      )}
      {user && currentScreen === "renew" && (
        <Renew user={user} navigate={navigate} />
      )}

      {user && isDashboardScreen && (
        <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      )}
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

export default App;
