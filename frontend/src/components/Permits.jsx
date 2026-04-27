import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { useToast } from "./toast/useToast";
import { PERMIT_DURATIONS } from "./permitConstants";
import {
  StepSelectType,
  StepSelectZone,
  StepSelectDurationVehicle,
  StepReviewSubmit,
} from "./PermitWizardSteps";

// ─── Main Component ───────────────────────────────────────────────────────────
const Permits = ({ user, navigate }) => {
  const toast = useToast();

  const [permits, setPermits] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("list");
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedApp, setSelectedApp] = useState(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    zone: "",
    duration: "",
    license_number: "",
  });
  const [showDocuments, setShowDocuments] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, vRes] = await Promise.all([
        api.get(`/permits/user/${user.user_id}`),
        api.get(`/vehicles/user/${user.user_id}`),
      ]);
      setPermits(pRes.data);
      setVehicles(vRes.data);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  }, [user.user_id]);

  useEffect(() => {
    if (!user?.user_id) return;
    fetchData();
  }, [fetchData]);

  const submitApplication = async () => {
    try {
      // Calculate start and end dates based on duration
      const startDate = new Date();
      let endDate = new Date();

      // Parse duration (e.g., "1 Month", "3 Months", "1 Year", "1 Day", "1 Week")
      const durationValue = parseInt(formData.duration);
      const durationUnit = formData.duration.includes("Month")
        ? "months"
        : formData.duration.includes("Year")
          ? "years"
          : formData.duration.includes("Week")
            ? "weeks"
            : "days";

      switch (durationUnit) {
        case "months":
          endDate.setMonth(endDate.getMonth() + durationValue);
          break;
        case "years":
          endDate.setFullYear(endDate.getFullYear() + durationValue);
          break;
        case "weeks":
          endDate.setDate(endDate.getDate() + durationValue * 7);
          break;
        default:
          endDate.setDate(endDate.getDate() + durationValue);
      }

      // Find the price for the selected duration
      const durations = PERMIT_DURATIONS[formData.type] || [];
      const selectedDuration = durations.find((d) => d.l === formData.duration);

      await api.post("/permits", {
        license_number: formData.license_number,
        type: formData.type,
        zone: formData.zone,
        duration: formData.duration,
        price: selectedDuration?.p || 0,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "pending", // or "active" if auto-approved
        application_date: startDate.toISOString(),
      });

      setMode("success");
      fetchData();
    } catch (error) {
      // Interceptor handles toast
      console.error("Submission error:", error);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.type) {
      toast.warning(
        "Select a Permit Type",
        "Please choose one of the four permit types to continue.",
      );
      return;
    }
    if (step === 2 && !formData.zone) {
      toast.warning(
        "Select a Zone",
        "Please choose an available parking zone to continue.",
      );
      return;
    }
    if (step === 3 && !formData.duration) {
      toast.warning(
        "Select a Time Limit",
        "Please choose how long you need the permit.",
      );
      return;
    }
    if (step === 3 && !formData.license_number) {
      toast.warning(
        "Select a Vehicle",
        "Please choose which vehicle this permit is for.",
      );
      return;
    }
    if (step < 4) setStep(step + 1);
    else submitApplication();
  };

  // ── Wizard Steps ──────────────────────────────────────────────────────────
  const renderWizardStep = () => {
    switch (step) {
      case 1:
        return (
          <StepSelectType
            formData={formData}
            onSelect={(typeId) =>
              setFormData({ ...formData, type: typeId, duration: "" })
            }
          />
        );
      case 2:
        return (
          <StepSelectZone
            formData={formData}
            onSelect={(zoneId) => setFormData({ ...formData, zone: zoneId })}
          />
        );
      case 3:
        return (
          <StepSelectDurationVehicle
            formData={formData}
            vehicles={vehicles}
            onDurationSelect={(d) => setFormData({ ...formData, duration: d })}
            onVehicleSelect={(ln) =>
              setFormData({ ...formData, license_number: ln })
            }
          />
        );
      case 4:
        return (
          <StepReviewSubmit
            formData={formData}
            onManageDocuments={() => setShowDocuments(true)}
          />
        );
    }
  };

  // ── Screen guards ─────────────────────────────────────────────────────────
  if (loading)
    return <div className="screen-container">Loading permits...</div>;

  if (mode === "status" && selectedApp) {
    const expectedMap = {
      Commercial: "Up to 24 hours",
      Handicap: "Up to 24 hours",
      Visitor: "Instant",
      Residential: "A few minutes",
    };

    const submittedAt = new Date(selectedApp.application_date || new Date());
    
    // Simulate current state of tracking based on time passed
    const now = new Date();
    const diffMins = (now - submittedAt) / 60000;
    
    const verifiedAt = new Date(submittedAt);
    verifiedAt.setMinutes(verifiedAt.getMinutes() + 1);
    
    const reviewedAt = new Date(submittedAt);
    reviewedAt.setMinutes(reviewedAt.getMinutes() + 2);

    const fmtDateTime = (d) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    const isVerified = diffMins > 1;
    const isReviewed = diffMins > 2;

    return (
      <div
        className="screen-container animate-fade-in"
        style={{ padding: 0, background: "var(--background)" }}
      >
        <div
          style={{
            background: "white",
            padding: "50px 24px 20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            onClick={() => setMode("list")}
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
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Application Status
          </h1>
        </div>

        <div style={{ padding: "24px" }}>
          <div
            className="card"
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                {selectedApp.type}
                <br />
                Parking
              </h2>
              <div
                style={{
                  background: selectedApp.status === 'Active' ? "#dcfce7" : "#fef3c7",
                  color: selectedApp.status === 'Active' ? "#166534" : "#b45309",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {selectedApp.status === 'Active' ? 'Approved' : 'Under Review'}
              </div>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "4px",
              }}
            >
              Application ID: {selectedApp.permit_id}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "24px",
              }}
            >
              Plate: {selectedApp.license_number}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Submitted</span>
              <span style={{ fontWeight: 600 }}>
                {submittedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
                fontSize: "14px",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                paddingBottom: "24px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Expected Completion
              </span>
              <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                {expectedMap[selectedApp.type] || "Today"}
              </span>
            </div>

            <h3
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
            >
              Application Timeline
            </h3>
            <div style={{ position: "relative", paddingLeft: "16px" }}>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  bottom: "20px",
                  left: "26px",
                  width: "2px",
                  background: "#e5e7eb",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: "25%",
                    left: 0,
                    width: "100%",
                    background: "#22c55e",
                  }}
                />
              </div>
              {[
                {
                  label: "Application Submitted",
                  date: fmtDateTime(submittedAt),
                  state: "done",
                },
                {
                  label: "Document Verification",
                  date: isVerified ? fmtDateTime(verifiedAt) : null,
                  state: isVerified ? "done" : "current",
                },
                {
                  label: "Review Completed",
                  date: isReviewed ? fmtDateTime(reviewedAt) : null,
                  state: isReviewed ? "done" : (isVerified ? "current" : "pending"),
                },
                { label: "Approved", date: null, state: selectedApp.status === 'Active' ? "done" : "pending" },
                { label: "Permit Active", date: null, state: selectedApp.status === 'Active' ? "done" : "pending" },
              ].map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "32px",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {t.state === "done" ? (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "12px",
                        background: "white",
                        border: "2px solid #22c55e",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#22c55e",
                        flexShrink: 0,
                      }}
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
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : t.state === "current" ? (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "12px",
                        background: "var(--primary)",
                        border: "4px solid #dbeafe",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "12px",
                        background: "#d1d5db",
                        border: "4px solid #f3f4f6",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: t.state === "current" ? 700 : 500,
                        color:
                          t.state === "pending"
                            ? "var(--text-secondary)"
                            : "var(--text-primary)",
                        marginBottom: "4px",
                      }}
                    >
                      {t.label}
                    </div>
                    {t.date && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {t.date}
                      </div>
                    )}
                    {t.state === "current" && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--primary)",
                          fontWeight: 600,
                        }}
                      >
                        In progress
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "apply") {
    return (
      <div
        className="screen-container"
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          background: "var(--background)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(to right, #1d71f2, #18c5b9)",
            color: "white",
            padding: "50px 24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <svg
              onClick={() => (step > 1 ? setStep(step - 1) : setMode("list"))}
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
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 600, margin: 0 }}>
                Apply for Permit
              </h1>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Step {step} of 4
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "4px",
                  background: i <= step ? "white" : "rgba(255,255,255,0.3)",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {showDocuments ? (
            <div className="animate-fade-in" style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <svg
                  onClick={() => setShowDocuments(false)}
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
                <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                  Manage Documents
                </h2>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "24px",
                  lineHeight: 1.5,
                }}
              >
                Ensure your documents are up to date.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    tag: "Driver's License",
                    status: "Verified",
                    color: "#166534",
                    bg: "#dcfce7",
                  },
                  {
                    tag: "Vehicle Registration",
                    status: "Verified",
                    color: "#166534",
                    bg: "#dcfce7",
                  },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{doc.tag}</div>
                    <div
                      style={{
                        background: doc.bg,
                        color: doc.color,
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {doc.status}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDocuments(false)}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "16px",
                }}
              >
                Done
              </button>
            </div>
          ) : (
            renderWizardStep()
          )}
        </div>

        {!showDocuments && (
          <div style={{ padding: "24px", background: "var(--background)" }}>
            <button
              onClick={nextStep}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "18px",
              }}
            >
              {step === 4 ? "Submit Application" : "Next"}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (mode === "success") {
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
            width: "80px",
            height: "80px",
            background: "rgba(52,199,89,0.1)",
            color: "var(--success)",
            borderRadius: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Application Submitted!
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "40px",
            lineHeight: 1.5,
          }}
        >
          Your permit application has been submitted successfully.
        </p>
        <button
          onClick={() => {
            setMode("list");
            setActiveTab("Applications");
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "16px",
            cursor: "pointer",
          }}
        >
          Track Application Status
        </button>
        <button
          onClick={() => setMode("list")}
          style={{
            width: "100%",
            padding: "16px",
            background: "transparent",
            color: "var(--text-secondary)",
            border: "none",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Return to Permits
        </button>
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <div
      className="screen-container animate-fade-in"
      style={{
        padding: 0,
        background: "var(--background)",
        paddingBottom: "100px",
      }}
    >
      <div style={{ padding: "60px 24px 20px", background: "white" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "24px" }}>
          Permits
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => {
              setStep(1);
              setFormData({
                type: "",
                zone: "",
                duration: "",
                license_number: "",
              });
              setMode("apply");
            }}
            style={{
              flex: 1,
              padding: "14px 10px",
              borderRadius: "12px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "13px",
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <svg
              width="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Apply for Permit
          </button>
          <button
            onClick={() => navigate("renew")}
            style={{
              flex: 1,
              padding: "14px 10px",
              borderRadius: "12px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "13px",
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <svg
              width="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Renew Permit
          </button>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        <div
          onClick={() => navigate("documents")}
          className="card"
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.05)",
            marginBottom: "24px",
            background: "white",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              background: "#eaddff",
              color: "#6b21a8",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "16px" }}>Documents</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Upload ID, proof of residence
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

        <div
          style={{
            background: "#e5e5ea",
            borderRadius: "12px",
            padding: "4px",
            display: "flex",
            marginBottom: "24px",
          }}
        >
          {["Active", "Applications"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                background: activeTab === tab ? "white" : "transparent",
                boxShadow:
                  activeTab === tab ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                color: activeTab === tab ? "black" : "var(--text-secondary)",
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {activeTab === "Active" ? (
          permits.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-secondary)",
                padding: "40px 0",
              }}
            >
              No active permits found.
            </div>
          ) : (
            permits.map((p) => {
              const daysLeft = Math.ceil(
                (new Date(p.expiry) - new Date()) / (1000 * 60 * 60 * 24),
              );
              const canRenew = daysLeft <= 30; // includes expired (negative daysLeft)
              return (
                <div
                  key={p.permit_id}
                  className="card"
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          marginBottom: "16px",
                          lineHeight: 1.2,
                        }}
                      >
                        {p.type}
                        <br />
                        Parking
                      </h2>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          marginBottom: "4px",
                        }}
                      >
                        ID: {p.permit_id}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Zone: Zone A
                      </div>
                    </div>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundImage:
                          "radial-gradient(black 30%, transparent 30%), radial-gradient(black 30%, transparent 30%)",
                        backgroundSize: "8px 8px",
                        backgroundPosition: "0 0, 4px 4px",
                        border: "2px solid black",
                        padding: "4px",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "white",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage:
                              "linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black), linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black)",
                            backgroundSize: "16px 16px",
                            backgroundPosition: "0 0, 8px 8px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                      paddingTop: "16px",
                      paddingBottom: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          marginBottom: "4px",
                        }}
                      >
                        Valid Until
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {new Date(p.expiry).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 12px",
                        border: "1px solid #ff9500",
                        color: "#ff9500",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {canRenew && (
                      <button
                        onClick={() => navigate("renew")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "white",
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: "8px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Renew
                      </button>
                    )}
                    <button
                      onClick={() => navigate("permitDetails", { permit: p })}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {permits.filter((p) => p.status === 'Pending').length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  padding: "40px 0",
                }}
              >
                No pending applications found.
              </div>
            ) : (
              permits
                .filter((p) => p.status === 'Pending')
                .map((app) => (
              <div
                key={app.id}
                className="card"
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                    {app.type}
                    <br />
                    Parking
                  </h2>
                  <div
                    style={{
                      background: "#fef3c7",
                      color: "#b45309",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Under Review
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  ID: {app.permit_id}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  Plate: {app.license_number}
                </div>
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  Submitted: {new Date(app.application_date || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                </div>
                <div
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    marginTop: "20px",
                    paddingTop: "20px",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setMode("status");
                    }}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      padding: "12px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "var(--text-primary)",
                    }}
                  >
                    Track Status
                  </button>
                </div>
              </div>
            )))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Permits;
