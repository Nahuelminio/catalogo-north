import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

ProgressBar.propTypes = { loading: PropTypes.bool };

export default function ProgressBar({ loading }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="progress"
          className="top-progress"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.85, transition: { duration: 2.5, ease: "easeOut" } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}
        />
      )}
    </AnimatePresence>
  );
}
