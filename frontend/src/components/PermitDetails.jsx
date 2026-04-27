const PermitDetails = ({ navigate, permit }) => {
  // Safe fallbacks for mock data when permit is not provided (e.g. from Payments mock)
  const isExpired = permit ? new Date(permit.expiry) < new Date() : false;
  const statusColor = isExpired ? "#b45309" : (permit?.status === 'Active' ? "#166534" : "#1d4ed8");
  const statusBg = isExpired ? "#fef3c7" : (permit?.status === 'Active' ? "#dcfce7" : "#fef3c7");

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  
  const displayType = permit?.type || "Residential";
  const displayId = permit?.permit_id || "PER-2026-9912";
  const displayStatus = isExpired ? "Expired" : (permit?.status || "Active");
  const displayPlate = permit?.license_number || "CAT2251";
  const displayZone = permit?.zone || "Zone A";
  const displayIssued = permit?.application_date ? formatDate(permit.application_date) : "Jan 10, 2026";
  const displayExpiry = permit?.expiry ? formatDate(permit.expiry) : "Dec 31, 2026";

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
          background: "#1d71f2",
          color: "white",
          padding: "50px 24px 24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg
          onClick={() => navigate("permits")}
          width="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ cursor: "pointer", marginRight: "16px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          Permit Details
        </h1>
      </div>

      <div style={{ padding: "24px" }}>
        <div
          className="card"
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
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
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}
              >
                {displayType}
                <br />
                Parking
              </h2>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                ID: {displayId}
              </div>
            </div>
            <div
              style={{
                background: statusBg,
                color: statusColor,
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {displayStatus}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "32px 0",
            }}
          >
            {/* Mock QR Code Pattern */}
            <div
              style={{
                width: "160px",
                height: "160px",
                backgroundImage:
                  "radial-gradient(black 30%, transparent 30%), radial-gradient(black 30%, transparent 30%)",
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 4px 4px",
                border: "4px solid black",
                padding: "8px",
                borderRadius: "12px",
              }}
            >
              <div
                style={{ width: "100%", height: "100%", background: "white" }}
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
                ></div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "32px",
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
                Vehicle Info
              </div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>{displayPlate}</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginBottom: "4px",
                }}
              >
                Zone
              </div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>{displayZone}</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginBottom: "4px",
                }}
              >
                Issued On
              </div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>
                {displayIssued}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginBottom: "4px",
                }}
              >
                Expires On
              </div>
              <div
                style={{ fontWeight: 600, fontSize: "15px", color: isExpired ? "#ff0000" : "#ff9500" }}
              >
                {displayExpiry}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("renew")}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Renew Permit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermitDetails;
