export default function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: "absolute", // stays inside app frame
        top: "12px",
        left: "0",
        right: "0",
        zIndex: 9999,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",

        padding: "0 16px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const s = {
          success: {
            bg: "#f0fdf4",
            border: "#86efac",
            icon: "✓",
            iconBg: "#22c55e",
            iconColor: "#fff",
          },
          error: {
            bg: "#fef2f2",
            border: "#fca5a5",
            icon: "✕",
            iconBg: "#ef4444",
            iconColor: "#fff",
          },
          warning: {
            bg: "#fffbeb",
            border: "#fcd34d",
            icon: "!",
            iconBg: "#f59e0b",
            iconColor: "#fff",
          },
          info: {
            bg: "#eff6ff",
            border: "#93c5fd",
            icon: "i",
            iconBg: "#3b82f6",
            iconColor: "#fff",
          },
        }[t.type] || {
          bg: "#eff6ff",
          border: "#93c5fd",
          icon: "i",
          iconBg: "#3b82f6",
          iconColor: "#fff",
        };

        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",

              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: "16px",

              padding: "14px 14px",
              width: "100%",
              maxWidth: "420px",

              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",

              pointerEvents: "all",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                background: s.iconBg,
                color: s.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>{t.title}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: "2px" }}>
                {t.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
