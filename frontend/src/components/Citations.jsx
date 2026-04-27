import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { useToast } from "./toast/useToast";

const Citations = ({ user, navigate }) => {
  const toast = useToast();
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Unpaid");

  const [disputingId, setDisputingId] = useState(null);
  const [disputeStep, setDisputeStep] = useState(1);
  const [disputeReason, setDisputeReason] = useState("");

  const fetchCitations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citations/user/${user.user_id}`);
      setCitations(res.data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [user.user_id]);

  useEffect(() => {
    fetchCitations();
  }, [fetchCitations]);

  const handlePay = async (id) => {
    toast.info(
      "Processing Payment",
      "Please wait while we process your payment...",
      { duration: 1500 },
    );

    try {
      await api.put(`/citations/${id}/pay`);
      toast.success(
        "Payment Successful",
        "Your citation has been paid. Thank you!",
      );
      await fetchCitations();
    } catch {
      toast.error(
        "Payment Failed",
        "Unable to process payment. Please try again.",
      );
    }
  };

  const submitDispute = async () => {
    if (disputeReason && disputeReason.trim().length > 0) {
      try {
        await api.post("/disputes", {
          issue_number: disputingId,
          reason: disputeReason,
        });
        toast.success(
          "Dispute Submitted",
          "Your dispute has been submitted successfully. Resolution takes 1-2 business days.",
        );
        setDisputingId(null);
        setDisputeStep(1);
        setDisputeReason("");
        await fetchCitations();
      } catch {
        toast.error(
          "Submission Failed",
          "Unable to submit dispute. Please try again.",
        );
      }
    } else {
      toast.warning(
        "Missing Information",
        "Please provide a reason for your dispute.",
      );
    }
  };

  const handlePhotoUpload = () => {
    toast.info(
      "Photo Upload",
      "Photo upload feature will be available in the next update.",
      { duration: 2000 },
    );
  };

  if (loading)
    return <div className="screen-container">Loading citations...</div>;

  if (disputingId) {
    return (
      <div
        className="screen-container animate-fade-in"
        style={{
          padding: 0,
          background: "var(--background)",
          minHeight: "100%",
        }}
      >
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
            onClick={() => {
              setDisputingId(null);
              setDisputeStep(1);
            }}
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
            Dispute Citation
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
            Dispute resolution takes 1-2 business days max. It is quicker with
            evidence like pictures.
          </p>

          <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
            <div
              style={{
                flex: 1,
                height: "4px",
                background: "var(--primary)",
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                flex: 1,
                height: "4px",
                background:
                  disputeStep === 2 ? "var(--primary)" : "rgba(0,0,0,0.1)",
                borderRadius: "2px",
              }}
            />
          </div>

          {disputeStep === 1 ? (
            <div className="animate-fade-in">
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                Provide Reason
              </h2>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Explain why you are disputing this citation..."
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  fontFamily: "inherit",
                  fontSize: "16px",
                  marginBottom: "24px",
                  resize: "none",
                }}
              />
              <button
                onClick={() => setDisputeStep(2)}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
                disabled={!disputeReason.trim()}
              >
                Next Step
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                Attach Evidence (Optional)
              </h2>
              <div
                style={{
                  width: "100%",
                  border: "2px dashed rgba(0,0,0,0.2)",
                  padding: "40px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "24px",
                  cursor: "pointer",
                  background: "white",
                }}
                onClick={handlePhotoUpload}
              >
                <div
                  style={{
                    background: "rgba(29, 113, 242, 0.1)",
                    width: "64px",
                    height: "64px",
                    borderRadius: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 16px",
                    color: "var(--primary)",
                  }}
                >
                  <svg
                    width="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "8px",
                  }}
                >
                  Upload Pictures
                </div>
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  Clear photos of the scene or signs
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setDisputeStep(1)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "var(--text-primary)",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={submitDispute}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const filteredCitations = citations.filter((c) => c.status === activeTab);

  return (
    <div
      className="screen-container animate-fade-in"
      style={{ padding: "0", background: "var(--background)" }}
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
        <h1 style={{ fontSize: "24px", margin: 0, fontWeight: 700 }}>
          Citations
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ padding: "24px 24px 0 24px" }}>
        <div
          style={{
            display: "flex",
            background: "#e5e5ea",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "24px",
          }}
        >
          {["Unpaid", "Paid"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab ? "white" : "transparent",
                color:
                  activeTab === tab
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                boxShadow:
                  activeTab === tab ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px", paddingTop: 0 }}>
        {filteredCitations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              padding: "60px 0",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(0,0,0,0.05)",
                borderRadius: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "18px",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              No {activeTab.toLowerCase()} citations
            </h3>
            <p>You're all clear!</p>
          </div>
        ) : (
          filteredCitations.map((c) => (
            <div
              key={c.issue_number}
              className="card"
              style={{
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.05)",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "var(--text-primary)",
                  }}
                >
                  {c.violation_code}
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "18px",
                    color:
                      c.status === "Paid" ? "var(--success)" : "var(--error)",
                  }}
                >
                  ${c.fine_amount}
                </span>
              </div>

              <div
                style={{
                  background: "var(--background)",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    VEHICLE
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    {c.license_number}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ISSUED
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    {new Date(c.issue_datetime).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {c.status === "Unpaid" && (
                <div
                  style={{ display: "flex", gap: "12px", marginTop: "16px" }}
                >
                  <button
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "2px solid rgba(0,0,0,0.1)",
                      color: "var(--text-primary)",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => setDisputingId(c.issue_number)}
                  >
                    Dispute
                  </button>
                  <button
                    style={{
                      flex: 2,
                      background: "var(--primary)",
                      border: "none",
                      color: "white",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onClick={() => handlePay(c.issue_number)}
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Citations;
