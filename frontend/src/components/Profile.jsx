import { useState } from "react";
import { useToast } from "./toast/useToast";

const Profile = ({ user, onLogout, navigate }) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "(555) 123-4567",
  });
  const [notificationsOn, setNotificationsOn] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    toast.success(
      "Profile Updated",
      "Your profile information has been saved successfully!",
    );
  };

  const handleLogout = () => {
    toast.info("Logging Out", "You have been successfully logged out.", {
      duration: 2000,
    });
    setTimeout(() => {
      onLogout();
    }, 500);
  };

  return (
    <div
      className="screen-container animate-fade-in"
      style={{
        padding: "24px 24px 80px 24px",
        background: "var(--background)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", margin: 0, fontWeight: 700 }}>
          My Profile
        </h1>
      </div>

      <div
        className="card"
        style={{ padding: "24px", marginBottom: "30px", position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "32px",
              background: "var(--primary)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {userInfo.name.charAt(0)}
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={{
              background: "transparent",
              border: "1px solid var(--primary)",
              color: "var(--primary)",
              padding: "6px 12px",
              borderRadius: "16px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Full Name
            </label>
            {isEditing ? (
              <input
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                {userInfo.name}
              </div>
            )}
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Email Address
            </label>
            {isEditing ? (
              <input
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div style={{ fontSize: "16px" }}>{userInfo.email}</div>
            )}
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Phone Number
            </label>
            {isEditing ? (
              <input
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div style={{ fontSize: "16px" }}>{userInfo.phone}</div>
            )}
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              User ID
            </label>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {user.user_id}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Settings
        </h3>

        <div className="card" style={{ padding: 0 }}>
          <div
            onClick={() => navigate("paymentMethods", { from: "profile" })}
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontWeight: 500 }}>Payment Methods</span>
            <span style={{ color: "var(--text-secondary)" }}>&gt;</span>
          </div>
          <div
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 500 }}>Push Notifications</span>
            <div
              onClick={() => setNotificationsOn(!notificationsOn)}
              style={{
                width: "44px",
                height: "24px",
                background: notificationsOn ? "#34C759" : "#e5e5ea",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: notificationsOn ? "22px" : "2px",
                  width: "20px",
                  height: "20px",
                  background: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Support
        </h3>

        <div className="card" style={{ padding: 0 }}>
          <div
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
            onClick={() => toast.info("Help Center", "Opening help center...")}
          >
            <span style={{ fontWeight: 500 }}>Help Center</span>
            <span style={{ color: "var(--text-secondary)" }}>&gt;</span>
          </div>
          <div
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() =>
              toast.info("Contact Support", "Opening contact options...")
            }
          >
            <span style={{ fontWeight: 500 }}>Contact City Parking</span>
            <span style={{ color: "var(--text-secondary)" }}>&gt;</span>
          </div>
        </div>
      </div>

      <button
        className="btn-secondary"
        style={{
          color: "var(--error)",
          borderColor: "var(--error)",
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: 600,
          marginBottom: "30px",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
