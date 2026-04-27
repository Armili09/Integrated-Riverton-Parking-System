import { useState, useCallback } from "react";
import { ToastContext } from "./ToastContextBase";
import ToastContainer from "./ToastContainer";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const baseToast = useCallback(
    ({ type = "info", title, message, duration = 3500 }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  // ✅ NO mutation (fixes your earlier error too)
  const toast = {
    show: baseToast,
    success: (t, m, o) =>
      baseToast({ type: "success", title: t, message: m, ...o }),
    error: (t, m, o) =>
      baseToast({ type: "error", title: t, message: m, ...o }),
    warning: (t, m, o) =>
      baseToast({ type: "warning", title: t, message: m, ...o }),
    info: (t, m, o) => baseToast({ type: "info", title: t, message: m, ...o }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};
