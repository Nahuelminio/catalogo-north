import React from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LinkButton({ icon: Icon, label, url, delay, onClick }) {
  const isModal = typeof onClick === "function";

  const shared = {
    className: "lt-btn",
    variants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.45, ease: "easeOut", delay },
    whileTap: { scale: 0.97 },
  };

  const content = (
    <>
      <span className="lt-icon">
        <Icon size={22} />
      </span>
      <span>{label}</span>
    </>
  );

  // Botones que abren modal → div clicable
  if (isModal) {
    return (
      <motion.div {...shared} onClick={onClick} role="button" tabIndex={0}>
        {content}
      </motion.div>
    );
  }

  // Links externos → <a> real para accesibilidad, SEO y long-press mobile
  return (
    <motion.a
      {...shared}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </motion.a>
  );
}
