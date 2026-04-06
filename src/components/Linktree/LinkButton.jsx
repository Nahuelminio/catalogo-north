import React from "react";
import { motion } from "framer-motion";

export default function LinkButton({ icon: Icon, label, url, delay, onClick }) {
  const isModal = typeof onClick === "function";

  return (
    <motion.div
      className="lt-btn"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      onClick={() => {
        if (isModal) onClick();
        else if (url) window.open(url, "_blank");
      }}
      role="button"
    >
      <span className="lt-icon">
        <Icon size={22} />
      </span>
      <span>{label}</span>
    </motion.div>
  );
}
