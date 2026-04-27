import { useState, useEffect } from "react";
import api from "../api";

const Renew = ({ user, navigate }) => {
  const [allPermits, setAllPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [mode, setMode] = useState("list"); // 'list' | 'confirm' | 'processing' | 'success'

  useEffect(() => {
    const fetchPermits = async () => {
      try {
        if (!user) return;
        const res = await api.get(`/permits/user/${user.user_id}`);
        // Include permits expiring within 30 days OR already expired
        const renewable = res.data.filter((p) => {
          if (p.status !== "Active" && p.status !== "Expired") return false;
          const daysLeft = Math.ceil(
            (new Date(p.expiry) - new Date()) / (1000 * 60 * 60 * 24),
          );
          return daysLeft <= 30; // covers expired (negative) and expiring soon
        });
        setAllPermits(renewable);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermits();
  }, [user]);

  const handleSelectPermit = (permit) => {
    setSelectedPermit(permit);
    setMode("confirm");
  };

  const handleRenew = async () => {
    setMode("processing");
    try {
      await api.put(`/permits/${selectedPermit.permit_id}/renew`);
      // Short delay to show processing state
      setTimeout(() => setMode("success"), 1200);
    } catch (err) {
      console.error(err);
      setMode("confirm"); // revert on error
    }
  };

  const getDaysLeft = (expiry) =>
    Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));

  const getStatusTag = (expiry) => {
    const days = getDaysLeft(expiry);
    if (days < 0) return { label: "Expired", bg: "#fee2e2", color: "#991b1b" };
    if (days <= 7)
      return { label: `${days}d left`, bg: "#fee2e2", color: "#991b1b" };
    return { label: `${days}d left`, bg: "#fef3c7", color: "#b45309" };
  };

  // ── Processing Screen ──────────────────────────────────────────────────────
  if (mode === "processing") {
    return (
      <div
        className="screen-container animate-fade-in"
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "36px",
            border: "4px solid #e5e7eb",
            borderTopColor: "var(--primary)",
            margin: "0 auto 24px",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
          Processing Payment
        </h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
          Please wait while we renew your permit…
        </p>
      </div>
    );
  }

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (mode === "success") {
    const newExpiry = new Date(selectedPermit.expiry);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    const newExpiryStr = newExpiry.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return (
      <div
        className="screen-container animate-fade-in"
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "32px 24px",
        }}
      >
        {/* Checkmark */}
        <div
          style={{
            width: "88px",
            height: "88px",
            background: "rgba(34,197,94,0.1)",
            borderRadius: "44px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg
            width="44"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#22c55e"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "10px" }}>
          Permit Renewed!
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Your <strong>{selectedPermit.type} Parking</strong> permit has been
          successfully renewed.
        </p>

        {/* Summary card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.06)",
            padding: "24px",
            marginBottom: "32px",
            boxShadow: "var(--shadow-sm)",
            textAlign: "left",
          }}
        >
          {[
            ["Permit Type", `${selectedPermit.type} Parking`],
            ["Permit ID", selectedPermit.permit_id],
            ["New Valid Until", newExpiryStr],
            ["Amount Paid", "$150.00"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{ fontSize: "14px", color: "var(--text-secondary)" }}
              >
                {label}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div
            style={{
              marginTop: "4px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Status
            </span>
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Active
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("permits")}
          style={{
            width: "100%",
            padding: "16px",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Back to Permits
        </button>
      </div>
    );
  }

  // ── Confirm & Pay Screen ───────────────────────────────────────────────────
  if (mode === "confirm" && selectedPermit) {
    const currentExpiryStr = new Date(selectedPermit.expiry).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
    const newExpiry = new Date(selectedPermit.expiry);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    const newExpiryStr = newExpiry.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const days = getDaysLeft(selectedPermit.expiry);
    const isExpired = days < 0;

    return (
      <div
        className="screen-container animate-fade-in"
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          background: "var(--background)",
          minHeight: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "white",
            padding: "50px 24px 20px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <button
            onClick={() => setMode("list")}
            style={{
              background: "rgba(29,113,242,0.1)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "18px",
              marginRight: "16px",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--primary)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Confirm Renewal
          </h1>
        </div>

        <div
          style={{
            padding: "24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Permit info banner */}
          <div
            style={{
              background: isExpired ? "#fef2f2" : "#fefce8",
              border: `1px solid ${isExpired ? "#fecaca" : "#fde68a"}`,
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <svg
              width="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke={isExpired ? "#ef4444" : "#f59e0b"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <p
              style={{
                fontSize: "13px",
                color: isExpired ? "#991b1b" : "#92400e",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {isExpired
                ? "This permit has expired. Renewing will reactivate it for 1 year from the original expiry date."
                : `This permit expires in ${days} day${days !== 1 ? "s" : ""}. Renewing now extends it by 1 year.`}
            </p>
          </div>

          {/* Details card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              {selectedPermit.type} Parking
            </h3>

            {[
              ["Permit ID", selectedPermit.permit_id],
              ["Current Expiry", currentExpiryStr],
              ["New Expiry Date", newExpiryStr],
            ].map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: i < 2 ? "16px" : "0",
                  marginBottom: i < 2 ? "16px" : "0",
                  borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}
              >
                <span
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color:
                      label === "New Expiry Date"
                        ? "#166534"
                        : "var(--text-primary)",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Payment card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 600 }}>
                Total Fee
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                $150.00
              </span>
            </div>

            {/* Payment method */}
            <div
              style={{
                background: "#f9fafb",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  background: "black",
                  color: "white",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  Apple Pay
                </div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Standard Payment Method
                </div>
              </div>
              <span
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Change
              </span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleRenew}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              marginTop: "auto",
            }}
          >
            Pay & Renew Now
          </button>
        </div>
      </div>
    );
  }

  // ── List Screen ────────────────────────────────────────────────────────────
  if (loading) return <div className="screen-container">Loading...</div>;

  return (
    <div
      className="screen-container animate-fade-in"
      style={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          padding: "50px 24px 20px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate("permits")}
          style={{
            background: "rgba(29,113,242,0.1)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "18px",
            marginRight: "16px",
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--primary)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
          Renew Permit
        </h1>
      </div>

      <div style={{ padding: "24px", flex: 1 }}>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "24px",
            lineHeight: 1.5,
          }}
        >
          Select a permit to renew. Only permits expiring within 30 days or
          already expired are shown.
        </p>

        {allPermits.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "36px",
                background: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg width="32" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "17px",
                  marginBottom: "6px",
                }}
              >
                All Good!
              </div>
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                None of your permits are expiring soon or expired. Check back
                when a permit is within 30 days of expiry.
              </div>
            </div>
            <button
              onClick={() => navigate("permits")}
              style={{
                marginTop: "8px",
                padding: "12px 24px",
                background: "white",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              Back to Permits
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {allPermits.map((p) => {
              const tag = getStatusTag(p.expiry);
              const days = getDaysLeft(p.expiry);
              const isExpired = days < 0;
              const expiryStr = new Date(p.expiry).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={p.permit_id}
                  className="card"
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    border: isExpired
                      ? "1.5px solid #fca5a5"
                      : "1.5px solid #fde68a",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {/* Top row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          marginBottom: "4px",
                        }}
                      >
                        {p.type} Parking
                      </h2>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        ID: {p.permit_id}
                      </div>
                    </div>
                    <div
                      style={{
                        background: tag.bg,
                        color: tag.color,
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {tag.label}
                    </div>
                  </div>

                  {/* Expiry info */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      {isExpired ? "Expired on" : "Expires on"}
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: isExpired ? "#991b1b" : "#b45309",
                      }}
                    >
                      {expiryStr}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectPermit(p)}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Renew This Permit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Renew;
