import { useState, useEffect } from "react";
import api from "../api";

const Home = ({ user, navigate }) => {
  const [activePermit, setActivePermit] = useState(null);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const permitsRes = await api.get(`/permits/user/${user.user_id}`);
        const active = permitsRes.data.find((p) => p.status === "Active");
        if (active) setActivePermit(active);

        const citationsRes = await api.get(`/citations/user/${user.user_id}`);
        setUnpaidCount(
          citationsRes.data.filter((c) => c.status === "Unpaid").length,
        );
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchDashboardData();
  }, [user.user_id]);

  return (
    <div
      className="screen-container animate-fade-in"
      style={{
        padding: 0,
        paddingBottom: "120px",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        minHeight: "100%",
      }}
    >
      {/* Top Gradient Header Section */}
      <div
        style={{
          background: "linear-gradient(to bottom, #1d71f2, #18c5b9)",
          padding: "40px 24px 80px",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}
            >
              Welcome Back!
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 500, opacity: 0.9 }}>
              {user.name}
            </p>
          </div>
          <div
            onClick={() => setShowNotifications(true)}
            style={{
              background: "rgba(255,255,255,0.2)",
              width: "40px",
              height: "40px",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <svg
              width="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "8px",
                height: "8px",
                background: "var(--error)",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area overlapping the header */}
      <div
        style={{
          padding: "0 24px",
          marginTop: "-60px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Active Permit Card */}
        <div
          className="card"
          style={{
            padding: "24px",
            borderRadius: "24px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            zIndex: 10,
          }}
        >
          {activePermit ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {activePermit.type} Parking
                </h2>
                <div
                  style={{
                    background: "#34C759",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Approved
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  ID: {activePermit.permit_id}
                </div>
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  Vehicle: {activePermit.license_number}
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  background:
                    "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px",
                  border: "8px solid white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  marginBottom: "16px",
                }}
              ></div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  Expires On:
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {new Date(activePermit.expiry).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "10px",
                }}
              >
                No Active Permit
              </h2>
              <p
                style={{ color: "var(--text-secondary)", marginBottom: "20px" }}
              >
                Apply for a permit to park legally in Riverton.
              </p>
            </div>
          )}
        </div>

        {/* Apply Card */}
        <div
          style={{
            background: "#00C8B3",
            borderRadius: "20px",
            padding: "20px",
            color: "white",
            marginBottom: "24px",
            boxShadow: "0 8px 20px rgba(32, 184, 165, 0.3)",
          }}
        >
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}
          >
            Need Another Permit?
          </h3>
          <p
            style={{
              fontSize: "14px",
              opacity: 0.9,
              marginBottom: "16px",
              lineHeight: "1.4",
            }}
          >
            Apply now and get approved in a few minutes
          </p>
          <button
            onClick={() => navigate("permits")}
            style={{
              background: "white",
              color: "#20b8a5",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            Apply for Permit
          </button>
        </div>

        {/* Quick Action grid */}
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: "8px 0 16px",
            color: "var(--text-primary)",
          }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            className="card"
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              margin: 0,
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              background: "white",
            }}
            onClick={() => navigate("vehicles")}
          >
            <div
              style={{
                background: "rgba(29, 113, 242, 0.1)",
                width: "50px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                color: "var(--primary)",
              }}
            >
              <svg
                width="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--text-primary)",
              }}
            >
              Vehicles
            </span>
          </div>

          <div
            className="card"
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              margin: 0,
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              background: "white",
            }}
            onClick={() => navigate("citations")}
          >
            <div
              style={{
                background: "#fce7f3",
                width: "50px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                color: "#ec4899",
              }}
            >
              <svg
                width="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--text-primary)",
              }}
            >
              Citations
            </span>
          </div>

          <div
            className="card"
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              margin: 0,
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              background: "white",
            }}
            onClick={() => navigate("payments")}
          >
            <div
              style={{
                background: "#d1fae5",
                width: "50px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                color: "#10b981",
              }}
            >
              <svg
                width="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 600,
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            >
              Payments
            </span>
          </div>

          <div
            className="card"
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              margin: 0,
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              background: "white",
            }}
            onClick={() => navigate("disputes")}
          >
            <div
              style={{
                background: "#ffedd5",
                width: "50px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                color: "#f97316",
              }}
            >
              <svg
                width="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--text-primary)",
              }}
            >
              Disputes
            </span>
          </div>
        </div>
      </div>

      {showNotifications && (
        <div
          className="animate-slide-up"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#f9fafb",
            zIndex: 100,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "50px 24px 16px",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <svg
              onClick={() => setShowNotifications(false)}
              width="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ cursor: "pointer", marginRight: "16px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <h2 style={{ fontSize: "20px", margin: 0, fontWeight: 700 }}>
              Notification Center
            </h2>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "16px",
                paddingLeft: "8px",
                textTransform: "uppercase",
              }}
            >
              Recent
            </h3>

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {/* Item 1 */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    background: "rgba(29, 113, 242, 0.1)",
                    color: "var(--primary)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "15px" }}>
                      Street Sweeping Alert
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      2h
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    Reminder: street sweeping tomorrow on Elm Street. Please
                    move your vehicle between 8AM - 12PM.
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 59, 48, 0.1)",
                    color: "var(--error)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "15px" }}>
                      Citation Issued
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      1d
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    A new citation has been issued to vehicle ABC-1234.
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
                <div
                  style={{
                    background: "rgba(52, 199, 89, 0.1)",
                    color: "var(--success)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "15px" }}>
                      Permit Approved
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      3d
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    Your residential parking permit has been approved and is now
                    active!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
