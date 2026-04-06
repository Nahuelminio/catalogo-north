// components/Toast.js
import React, { useEffect } from "react";

export default function Toast({
  open,
  onClose,
  message,
  type = "success",
  ms = 3500,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, ms);
    return () => clearTimeout(t);
  }, [open, onClose, ms]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast ${type}`}
      onClick={onClose}
    >
      <span className="toast-icon" aria-hidden>
        ✓
      </span>
      <p className="toast-msg">{message}</p>
    </div>
  );
}
