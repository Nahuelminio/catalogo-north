import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Bot } from "lucide-react";
import "./ChatBot.css";

const WEBHOOK_URL = process.env.REACT_APP_CHATBOT_WEBHOOK || "";

const WELCOME = {
  id: "welcome",
  role: "bot",
  text: "¡Hola! 👋 Soy el asistente de The North Shop. Preguntame sobre nuestros productos, puffs, gustos o cualquier duda que tengas.",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || !WEBHOOK_URL) return;

    setInput("");
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("Error en la respuesta");

      const data = await res.json();
      const arr = Array.isArray(data) ? data[0] : data;

      // Extraer recursivamente el primer string encontrado
      function extractText(obj) {
        if (typeof obj === "string") return obj;
        if (!obj || typeof obj !== "object") return null;
        const keys = ["content", "response", "text", "output", "message"];
        for (const k of keys) {
          const val = extractText(obj[k]);
          if (val) return val;
        }
        return null;
      }

      const botText = extractText(arr) || "No pude procesar tu consulta, intentá de nuevo.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: botText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Ups, hubo un error de conexión. Intentá de nuevo en un momento. 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Ventana del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-window"
            role="dialog"
            aria-label="Asistente The North Shop"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <Bot size={20} />
                </div>
                <div>
                  <p className="chatbot-name">Asistente North</p>
                  <p className="chatbot-status">
                    <span className="chatbot-dot" />
                    En línea
                  </p>
                </div>
              </div>
              <button
                className="chatbot-close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="chatbot-messages">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  className={`chatbot-bubble chatbot-bubble--${m.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <p>{m.text}</p>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  className="chatbot-bubble chatbot-bubble--bot chatbot-typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span /><span /><span />
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              className="chatbot-input-row"
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            >
              <input
                ref={inputRef}
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Escribí tu consulta..."
                disabled={loading}
                autoComplete="off"
              />
              <button
                className="chatbot-send"
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Enviar"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón toggle */}
      <motion.button
        className={`chatbot-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir asistente virtual"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -80, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 80, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 80, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -80, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
