import { PERMIT_DURATIONS, ZONES } from "./permitConstants";

// ── Step 1: Select Permit Type ────────────────────────────────────────────────
export const StepSelectType = ({ formData, onSelect }) => (
  <div className="animate-fade-in" style={{ padding: "20px" }}>
    <h2
      style={{
        fontSize: "22px",
        fontWeight: 700,
        textAlign: "center",
        marginBottom: "6px",
      }}
    >
      Select Permit Type
    </h2>
    <p
      style={{
        color: "var(--text-secondary)",
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "14px",
      }}
    >
      Choose the permit that fits your needs
    </p>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "14px",
        alignItems: "stretch",
      }}
    >
      {[
        {
          id: "Residential",
          icon: "🏠",
          desc: "For residents in permit zones",
        },
        { id: "Commercial", icon: "💼", desc: "For businesses & contractors" },
        {
          id: "Handicap",
          icon: "♿",
          desc: "Free permit for disabled parking",
        },
        {
          id: "Visitor",
          icon: "🪪",
          desc: "Short-term permits for guests",
        },
      ].map((t) => (
        <div
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            background: "white",
            border:
              formData.type === t.id
                ? "2px solid var(--primary)"
                : "1px solid rgba(0,0,0,0.1)",
            borderRadius: "16px",
            padding: "20px 16px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow:
              formData.type === t.id
                ? "0 6px 18px rgba(29,113,242,0.18)"
                : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "180px",
            height: "100%",
          }}
        >
          <div style={{ fontSize: "42px", lineHeight: 1 }}>{t.icon}</div>
          <div style={{ fontWeight: 700, fontSize: "16px" }}>{t.id}</div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            {t.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Step 2: Select Zone ───────────────────────────────────────────────────────
export const StepSelectZone = ({ formData, onSelect }) => (
  <div
    className="animate-fade-in"
    style={{
      padding: 0,
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ padding: "20px", paddingBottom: "0" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "6px",
        }}
      >
        Select Your Zone
      </h2>
      <p
        style={{
          color: "var(--text-secondary)",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        Choose the parking zone for your permit
      </p>
    </div>

    <div style={{ padding: "24px", background: "var(--background)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            onClick={() => zone.available && onSelect(zone.id)}
            className="card"
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: formData.zone === zone.id ? "#eef4ff" : "white",
              border:
                formData.zone === zone.id
                  ? "2px solid var(--primary)"
                  : "1px solid rgba(0,0,0,0.05)",
              cursor: zone.available ? "pointer" : "not-allowed",
              opacity: zone.available ? 1 : 0.6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div
                  style={{
                    background: "#1d71f2",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    flexShrink: 0,
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      marginBottom: "2px",
                    }}
                  >
                    {zone.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      margin: 0,
                    }}
                  >
                    {zone.desc}
                  </p>
                </div>
              </div>
              <div
                style={{
                  background: zone.available ? "#dcfce7" : "#fee2e2",
                  color: zone.available ? "#166534" : "#991b1b",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {zone.available ? "Available" : "Full"}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "6px 16px",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Rate
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  textAlign: "right",
                }}
              >
                {zone.rate}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Restrictions
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {zone.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Step 3: Select Duration & Vehicle ─────────────────────────────────────────
export const StepSelectDurationVehicle = ({
  formData,
  vehicles,
  onDurationSelect,
  onVehicleSelect,
}) => {
  const durations = PERMIT_DURATIONS[formData.type] || [];

  return (
    <div className="animate-fade-in" style={{ padding: "24px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
          Select Time Limit
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          {formData.type} permit · {formData.zone}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        {durations.map((d) => (
          <div
            key={d.l}
            onClick={() => onDurationSelect(d.l)}
            style={{
              padding: "20px 24px",
              borderRadius: "12px",
              background: formData.duration === d.l ? "#eef4ff" : "white",
              border:
                formData.duration === d.l
                  ? "2px solid var(--primary)"
                  : "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              <span>{d.l}</span>
              <span style={{ color: "rgba(0,0,0,0.2)" }}>|</span>
              <span>{d.p}</span>
            </div>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "12px",
                border:
                  formData.duration === d.l
                    ? "6px solid var(--primary)"
                    : "2px solid rgba(0,0,0,0.2)",
                background: "white",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
          Select Vehicle
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Which vehicle is this permit for?
        </p>
      </div>

      {vehicles.length === 0 ? (
        <div
          style={{
            padding: "16px",
            background: "rgba(255,0,0,0.05)",
            color: "var(--error)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          You must add a vehicle first!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {vehicles.map((v) => (
            <div
              key={v.license_number}
              onClick={() => onVehicleSelect(v.license_number)}
              style={{
                padding: "20px 24px",
                borderRadius: "12px",
                background:
                  formData.license_number === v.license_number
                    ? "#eef4ff"
                    : "white",
                border:
                  formData.license_number === v.license_number
                    ? "2px solid var(--primary)"
                    : "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div
                  style={{
                    background:
                      formData.license_number === v.license_number
                        ? "#dbeafe"
                        : "#f3f4f6",
                    color:
                      formData.license_number === v.license_number
                        ? "var(--primary)"
                        : "var(--text-secondary)",
                    padding: "10px",
                    borderRadius: "8px",
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
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    {v.type === "SUV"
                      ? "2023 Ford Explorer"
                      : "2022 Toyota Camry"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        border: "1px solid rgba(0,0,0,0.1)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {v.license_number}
                    </span>
                    <span>{v.type}</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "12px",
                  border:
                    formData.license_number === v.license_number
                      ? "6px solid var(--primary)"
                      : "2px solid rgba(0,0,0,0.2)",
                  background: "white",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Step 4: Review & Submit ───────────────────────────────────────────────────
export const StepReviewSubmit = ({ formData, onManageDocuments }) => (
  <div className="animate-fade-in" style={{ padding: "24px" }}>
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
        Review and Submit
      </h2>
      <p style={{ color: "var(--text-secondary)" }}>
        Confirm your application details
      </p>
    </div>

    {/* Application Summary — neutral slate */}
    <div
      style={{
        background: "white",
        border: "2px solid #00C8B3",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <svg
          width="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "var(--text-primary)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            margin: 0,
            color: "var(--text-primary)",
          }}
        >
          Application Summary
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px 8px",
          marginBottom: "20px",
        }}
      >
        {[
          ["Permit Type", `${formData.type} Parking`],
          ["Duration", formData.duration],
          ["Vehicle", formData.license_number || "None"],
          ["Zone", formData.zone],
        ].map(([label, value]) => (
          <>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {label}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                textAlign: "right",
                color: "var(--text-primary)",
              }}
            >
              {value}
            </div>
          </>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          paddingTop: "16px",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          Total Amount
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          {(PERMIT_DURATIONS[formData.type] || []).find(
            (d) => d.l === formData.duration,
          )?.p || "—"}
        </div>
      </div>
    </div>

    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.05)",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <svg width="20" fill="none" viewBox="0 0 24 24" stroke="black">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
          Documents
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {["Driver's License", "Proof of Residence", "Vehicle Registration"].map(
          (doc) => (
            <div
              key={doc}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {doc}
                </div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Verified Mar 15, 2026
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
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
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified
              </div>
            </div>
          ),
        )}
      </div>

      <button
        onClick={onManageDocuments}
        style={{
          width: "100%",
          background: "transparent",
          border: "1px solid rgba(0,0,0,0.2)",
          padding: "12px",
          borderRadius: "8px",
          fontWeight: 600,
          color: "var(--text-primary)",
          cursor: "pointer",
        }}
      >
        Manage Documents
      </button>
    </div>
  </div>
);
