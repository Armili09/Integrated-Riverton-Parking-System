import { useState, useEffect } from "react";
import api from "../api";

const Payments = ({ user, navigate }) => {
  const [citations, setCitations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          api.get(`/citations/user/${user.user_id}`),
          api.get(`/transactions/user/${user.user_id}`)
        ]);
        setCitations(cRes.data);
        setTransactions(tRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.user_id]);

  const unpaidCitations = citations.filter((c) => c.status === "Unpaid");
  const unpaidFines = unpaidCitations.reduce(
    (sum, c) => sum + c.fine_amount,
    0,
  );
  const total = unpaidFines;

  if (loading)
    return <div className="screen-container">Loading payments...</div>;

  return (
    <div
      className="screen-container animate-fade-in"
      style={{ padding: 0, background: "var(--background)" }}
    >
      {/* Standardized Header */}
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
          onClick={() => navigate("home")}
          style={{
            background: "rgba(29, 113, 242, 0.1)",
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
          Payments
        </h1>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Payment Methods Card */}
        <div
          onClick={() => navigate("paymentMethods", { from: "payments" })}
          className="card"
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.05)",
            marginBottom: "24px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              background: "#dbeafe",
              color: "#3b82f6",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "16px" }}>
              Payment Methods
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Manage your cards
            </div>
          </div>
          <svg
            width="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--text-secondary)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Payment Summary */}
        <div
          style={{
            background: "#f0f7ff",
            border: "1px solid #bfdbfe",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: "#1d4ed8",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Payment Summary
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              color: "#2563eb",
              fontSize: "14px",
            }}
          >
            <span>Violation Fines ({unpaidCitations.length})</span>
            <span>${unpaidFines.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #bfdbfe",
              paddingTop: "16px",
              color: "#2563eb",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            <span>Total Outstanding</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {total > 0 ? (
            <button
              className="btn-primary"
              onClick={() =>
                navigate("payBalance", {
                  permitFees: 0,
                  unpaidFines,
                  total,
                  unpaidCitations,
                })
              }
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              Pay Balance
            </button>
          ) : (
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                textAlign: "center",
                color: "#1d4ed8",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              You have no outstanding balances.
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div
          style={{
            background: "#e5e5ea",
            borderRadius: "12px",
            padding: "4px",
            display: "flex",
            marginBottom: "24px",
          }}
        >
          {["All", "Permits", "Citations"].map((t) => (
            <div
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                background: tab === t ? "white" : "transparent",
                boxShadow: tab === t ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                color: tab === t ? "black" : "var(--text-secondary)",
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Recent / Outstanding Items */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          Due / History
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {transactions.filter((t) => tab === "All" || t.type + "s" === tab).map((t) => (
            <div
              key={t.transaction_id}
              className="card"
              style={{
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "18px" }}>
                  {t.type === 'Permit' ? 'Permit Payment' : 'Citation Payment'}
                </div>
                <div style={{ fontSize: "18px" }}>${t.amount.toFixed(2)}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  {t.type === 'Permit' ? `${t.subtype} Parking` : `Violation: ${t.subtype}`}<br />
                  Plate: {t.license_number}<br />
                  ID: {t.transaction_id}
                </div>
                <div>
                  <span
                    style={{
                      padding: "4px 8px",
                      background: "rgba(52, 199, 89, 0.15)",
                      color: "var(--success)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Paid
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <svg
                    width="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Credit Card •••• 4242
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <svg
                    width="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    gap: "6px",
                    color: "var(--text-primary)",
                  }}
                >
                  <svg
                    width="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Receipt
                </button>
                {t.type === 'Permit' && (
                  <button
                    onClick={() => navigate("permitDetails")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}

          {(tab === "All" || tab === "Citations") &&
            unpaidCitations.map((c) => (
              <div
                key={c.issue_number}
                className="card"
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 59, 48, 0.2)",
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "var(--error)",
                    }}
                  >
                    Citation fine
                  </div>
                  <div style={{ fontSize: "18px", color: "var(--error)" }}>
                    ${c.fine_amount.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                  >
                    {c.violation_code}
                    <br />
                    Plate: {c.license_number}
                  </div>
                  <div>
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "rgba(255, 59, 48, 0.1)",
                        color: "var(--error)",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      Unpaid
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
