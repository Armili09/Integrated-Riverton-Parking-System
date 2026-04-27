import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { useToast } from "./toast/useToast";

const Disputes = ({ user, navigate }) => {
  const toast = useToast();
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchCitations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citations/user/${user.user_id}`);
      setCitations(res.data.filter((c) => c.status === "Disputed"));
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [user.user_id]);

  useEffect(() => {
    fetchCitations();
  }, [fetchCitations]);

  const getStatusDetails = (status) => {
    switch (status) {
      case "Under Review":
        return {
          color: "#d97706",
          bg: "#fef3c7",
          label: "Under Review",
          progress: 33,
        };
      case "Investigation":
        return {
          color: "#2563eb",
          bg: "#dbeafe",
          label: "Investigation",
          progress: 66,
        };
      case "Resolved - Approved":
        return {
          color: "#16a34a",
          bg: "#dcfce7",
          label: "Approved",
          progress: 100,
        };
      case "Resolved - Denied":
        return {
          color: "#dc2626",
          bg: "#fee2e2",
          label: "Denied",
          progress: 100,
        };
      default:
        return {
          color: "#6b7280",
          bg: "#f3f4f6",
          label: "Pending",
          progress: 0,
        };
    }
  };

  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading)
    return <div className="screen-container">Loading disputes...</div>;

  return (
    <div
      className="screen-container animate-fade-in"
      style={{ padding: 0, background: "var(--background)" }}
    >
      {/* Standardized Header - Matching Payments.jsx */}
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
          My Disputes
        </h1>
      </div>

      <div style={{ padding: "24px" }}>
        {citations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(29, 113, 242, 0.1)",
                borderRadius: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="var(--primary)"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "var(--text-primary)",
              }}
            >
              No Active Disputes
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              You don't have any citation disputes in progress.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {citations.map((c) => {
              const statusDetails = getStatusDetails(
                c.dispute_status || "Under Review",
              );
              const isExpanded = expandedId === c.issue_number;

              return (
                <div
                  key={c.issue_number}
                  className="card"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: `1px solid ${statusDetails.color}20`,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Main Content */}
                  <div style={{ padding: "20px" }}>
                    {/* Top Row - Citation and Fine */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "inline-block",
                            background: statusDetails.bg,
                            color: statusDetails.color,
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            marginBottom: "12px",
                          }}
                        >
                          {statusDetails.label}
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            marginBottom: "4px",
                            color: "var(--text-primary)",
                          }}
                        >
                          Citation #{c.issue_number}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Violation: {c.violation_code}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: statusDetails.color,
                          }}
                        >
                          ${c.fine_amount?.toFixed(2) || "0.00"}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Original Fine
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          height: "4px",
                          background: "#f3f4f6",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${statusDetails.progress}%`,
                            height: "100%",
                            background: statusDetails.color,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Key Information Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "12px",
                        marginBottom: "20px",
                        padding: "16px 0",
                        borderTop: "1px solid rgba(0,0,0,0.05)",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: "4px",
                          }}
                        >
                          License Plate
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "monospace",
                            color: "var(--text-primary)",
                          }}
                        >
                          {c.license_number}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: "4px",
                          }}
                        >
                          Submitted
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {formatDate(c.dispute_date)}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: "4px",
                          }}
                        >
                          Violation Date
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {formatDate(c.violation_date)}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: "4px",
                          }}
                        >
                          Location
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--text-primary)",
                          }}
                        >
                          {c.location || "Not specified"}
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : c.issue_number)
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "transparent",
                        border: `1px solid ${statusDetails.color}40`,
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: statusDetails.color,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s",
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
                          d={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                        />
                      </svg>
                      {isExpanded ? "Show Less" : "View Details"}
                    </button>
                  </div>

                  {/* Expanded Section - Timeline */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "20px",
                        background: "#f9fafb",
                        borderTop: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "16px",
                          color: "var(--text-primary)",
                        }}
                      >
                        Dispute Timeline
                      </h4>
                      <div
                        style={{ position: "relative", paddingLeft: "24px" }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "8px",
                            top: "8px",
                            bottom: "8px",
                            width: "2px",
                            background: "#e5e7eb",
                          }}
                        />

                        {/* Timeline Item 1 */}
                        <div
                          style={{
                            marginBottom: "24px",
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-16px",
                              top: "0",
                              width: "8px",
                              height: "8px",
                              borderRadius: "4px",
                              background: "#22c55e",
                              border: "2px solid white",
                              boxShadow: "0 0 0 2px #f9fafb",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "4px",
                              color: "var(--text-primary)",
                            }}
                          >
                            Dispute Submitted
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {formatDateTime(c.dispute_date)}
                          </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div
                          style={{
                            marginBottom: "24px",
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-16px",
                              top: "0",
                              width: "8px",
                              height: "8px",
                              borderRadius: "4px",
                              background:
                                c.dispute_status === "Under Review"
                                  ? "var(--primary)"
                                  : "#d1d5db",
                              border: "2px solid white",
                              boxShadow: "0 0 0 2px #f9fafb",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight:
                                c.dispute_status === "Under Review" ? 600 : 500,
                              marginBottom: "4px",
                              color:
                                c.dispute_status === "Under Review"
                                  ? "var(--primary)"
                                  : "var(--text-secondary)",
                            }}
                          >
                            Initial Review
                          </div>
                          {c.dispute_status === "Under Review" && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--primary)",
                                fontWeight: 500,
                              }}
                            >
                              In progress
                            </div>
                          )}
                        </div>

                        {/* Timeline Item 3 */}
                        <div
                          style={{
                            marginBottom: "24px",
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-16px",
                              top: "0",
                              width: "8px",
                              height: "8px",
                              borderRadius: "4px",
                              background:
                                c.dispute_status === "Investigation"
                                  ? "var(--primary)"
                                  : "#d1d5db",
                              border: "2px solid white",
                              boxShadow: "0 0 0 2px #f9fafb",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight:
                                c.dispute_status === "Investigation"
                                  ? 600
                                  : 500,
                              marginBottom: "4px",
                              color:
                                c.dispute_status === "Investigation"
                                  ? "var(--primary)"
                                  : "var(--text-secondary)",
                            }}
                          >
                            Investigation
                          </div>
                          {c.dispute_status === "Investigation" && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--primary)",
                                fontWeight: 500,
                              }}
                            >
                              Under investigation
                            </div>
                          )}
                        </div>

                        {/* Timeline Item 4 */}
                        <div style={{ position: "relative", zIndex: 2 }}>
                          <div
                            style={{
                              position: "absolute",
                              left: "-16px",
                              top: "0",
                              width: "8px",
                              height: "8px",
                              borderRadius: "4px",
                              background: c.dispute_status?.includes("Resolved")
                                ? "#22c55e"
                                : "#d1d5db",
                              border: "2px solid white",
                              boxShadow: "0 0 0 2px #f9fafb",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              marginBottom: "4px",
                              color: "var(--text-primary)",
                            }}
                          >
                            Final Decision
                          </div>
                          {c.dispute_status?.includes("Resolved") && (
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color:
                                  c.dispute_status === "Resolved - Approved"
                                    ? "#16a34a"
                                    : "#dc2626",
                              }}
                            >
                              {c.dispute_status === "Resolved - Approved"
                                ? "Approved ✓"
                                : "Denied ✗"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Disputes;
