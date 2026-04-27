import { useState } from "react";
const PayBalance = ({
  navigate,
  user,
  permitFees = 150,
  unpaidFines = 0,
  total,
  unpaidCitations = [],
}) => {
  const resolvedTotal = total ?? permitFees + unpaidFines;
  const [selectedMethod, setSelectedMethod] = useState("visa");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate("payments");
    }, 2000);
  };

  return (
    <div
      className="screen-container animate-fade-in"
      style={{
        padding: 0,
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
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
          onClick={() => navigate("payments")}
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
          Pay Balance
        </h1>
      </div>

      <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
        {/* Amount Due */}
        <div
          style={{
            background: "#f0f7ff",
            border: "1px solid #bfdbfe",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#2563eb",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Total Amount Due
          </div>
          <div style={{ fontSize: "42px", fontWeight: 700, color: "#1d4ed8" }}>
            ${resolvedTotal.toFixed(2)}
          </div>
        </div>

        {/* Breakdown */}
        <div
          className="card"
          style={{
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{ fontWeight: 600, fontSize: "16px", marginBottom: "16px" }}
          >
            Breakdown
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Permit Renewal - Zone A
            </span>
            <span style={{ fontWeight: 500 }}>${permitFees.toFixed(2)}</span>
          </div>
          {unpaidCitations.length > 0 ? (
            unpaidCitations.map((c) => (
              <div
                key={c.issue_number}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Citation — {c.violation_code}
                </span>
                <span style={{ fontWeight: 500 }}>
                  ${c.fine_amount.toFixed(2)}
                </span>
              </div>
            ))
          ) : unpaidFines > 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Violation Fines
              </span>
              <span style={{ fontWeight: 500 }}>${unpaidFines.toFixed(2)}</span>
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              paddingTop: "12px",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span>${resolvedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{ fontWeight: 600, fontSize: "16px", marginBottom: "12px" }}
          >
            Payment Method
          </div>
          <div
            onClick={() => setSelectedMethod("visa")}
            className="card"
            style={{
              padding: "16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
              border:
                selectedMethod === "visa"
                  ? "2px solid var(--primary)"
                  : "1px solid rgba(0,0,0,0.07)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                background: "#1d71f2",
                color: "white",
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              VISA
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Visa •••• 4242</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Expires 12/28
              </div>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "10px",
                border:
                  selectedMethod === "visa"
                    ? "6px solid var(--primary)"
                    : "2px solid #ccc",
              }}
            />
          </div>
          <div
            onClick={() => navigate("paymentMethods", { from: "payBalance" })}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px dashed rgba(29,113,242,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              color: "var(--primary)",
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span style={{ fontWeight: 600, fontSize: "14px" }}>
              Add Payment Method
            </span>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <div
        style={{
          padding: "16px 24px 32px",
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <button
          className="btn-primary"
          onClick={handlePay}
          disabled={processing}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            opacity: processing ? 0.7 : 1,
            cursor: processing ? "not-allowed" : "pointer",
          }}
        >
          {processing ? "Processing..." : `Pay $${resolvedTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PayBalance;
