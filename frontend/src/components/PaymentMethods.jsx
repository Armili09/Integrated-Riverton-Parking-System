const PaymentMethods = ({ navigate, from }) => {
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
          onClick={() => navigate(from || "payments")}
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
          Payment Methods
        </h1>
      </div>

      <div style={{ padding: "24px", flex: 1 }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Saved Cards
        </h3>

        {/* Saved Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            className="card"
            style={{
              background: "#1d71f2",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxShadow: "0 8px 16px rgba(29, 113, 242, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Visa</div>
              <svg
                width="32"
                viewBox="0 0 24 24"
                fill="none"
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
            <div
              style={{
                display: "flex",
                gap: "16px",
                fontSize: "18px",
                letterSpacing: "2px",
                opacity: 0.9,
              }}
            >
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span>4242</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              <div>Primary Method</div>
              <div>Expires 12/28</div>
            </div>
          </div>
        </div>

        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Digital Wallets
        </h3>

        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
                fontSize: "20px",
                fontWeight: "bold",
              }}
            ></div>
            <div style={{ fontWeight: 600 }}>Apple Pay</div>
          </div>
          <button
            style={{
              border: "none",
              background: "transparent",
              color: "var(--primary)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Connect
          </button>
        </div>

        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div
              style={{
                background: "white",
                color: "#db4437",
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              G
            </div>
            <div style={{ fontWeight: 600 }}>Google Pay</div>
          </div>
          <button
            style={{
              border: "none",
              background: "transparent",
              color: "var(--primary)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Connect
          </button>
        </div>

        <button
          className="btn-primary"
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(29, 113, 242, 0.3)",
          }}
        >
          <svg width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Method
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;
