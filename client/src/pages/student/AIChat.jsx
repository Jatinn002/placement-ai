import React, { useState, useRef, useEffect } from "react";
import {
  SendHorizonal,
  Bot,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AI_RESPONSES = [
  "Based on your profile, you should focus on DSA and resume improvement.",
  "Your current readiness is moderate. Practice arrays and aptitude.",
  "I recommend 3 DSA problems daily and 1 mock interview weekly.",
];

// Chat Bubble Animation Variants
const bubbleVariants = {
  initial: { opacity: 0, scale: 0.97, y: 24 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 17, stiffness: 220 } },
  exit: { opacity: 0, scale: 0.97, y: 20, transition: { duration: 0.17 } },
};

function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} px-0 py-1`}
    >
      <div className={`flex items-start w-full max-w-3xl`}>
        {!isUser && (
          <div
            className="flex-shrink-0 flex items-center mr-3"
          >
            <Bot
              className="w-8 h-8 p-1 bg-gradient-to-tr from-cyan-500/80 to-cyan-800/70 border border-cyan-700 rounded-full text-white shadow-md"
              strokeWidth={2.1}
            />
          </div>
        )}
        <div
          className={`relative min-h-[42px] text-base max-w-2xl w-fit
            ${isUser ? "bg-white/70 text-slate-900 rounded-xl ml-auto mr-0" : "bg-slate-800/95 text-slate-50 rounded-xl mr-auto ml-0"}
            px-5 py-3 shadow-[0_2px_18px_0_rgba(32,36,68,0.13)]
            leading-relaxed prose prose-slate
            ${isUser ? "prose-p:text-right" : "prose-p:text-left"}
            chat-bubble
          `}
          style={{
            borderTopLeftRadius: isUser ? 20 : 8,
            borderTopRightRadius: isUser ? 8 : 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            border: isUser ? "1.5px solid #A7A3F9" : "1.5px solid #334155",
            marginLeft: isUser ? "auto" : "",
            marginRight: isUser ? "" : "auto",
            wordBreak: "break-word",
            boxShadow: isUser
              ? "0px 2px 24px rgba(79,70,229,0.13)"
              : "0px 2px 24px rgba(6,182,212,0.13)"
          }}
        >
          {message}
        </div>
        {isUser && (
          <div className="flex-shrink-0 flex items-center ml-3">
            <User
              className="w-8 h-8 p-1 bg-gradient-to-br from-indigo-400/80 to-indigo-900/80 border border-indigo-500 rounded-full text-white shadow-md"
              strokeWidth={2.2}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm your AI Career Coach. How can I help with your placement prep today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMessage = {
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiText =
        AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiText },
      ]);
      setLoading(false);
    }, 1100);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-950 via-slate-900/95 to-[#181d2a] sm:px-0">
      <section className="w-full max-w-3xl px-0 sm:px-6 pt-12 pb-7">
        <div className="flex items-center gap-3 mb-2 pl-2">
          <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" strokeWidth={2.1} />
          <h1 className="font-extrabold text-3xl text-white tracking-tight">
            AI Career Coach
          </h1>
        </div>
        <p className="text-slate-400 text-base pl-3 mt-0 mb-2">
          Ask anything about your placement preparation
        </p>
      </section>

      <section
        className="relative flex-1 flex flex-col items-center w-full max-w-3xl px-1 sm:px-2"
        style={{ minHeight: "360px" }}
      >
        <div
          ref={chatRef}
          className="w-full flex-1 overflow-y-auto no-scrollbar
            bg-slate-950/85 rounded-2xl border border-slate-800 shadow-xl
            px-0 sm:px-2 py-4
            transition-all duration-200
            max-h-[calc(100vh-265px)] min-h-[268px]
            chat-scroll"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg.text}
                isUser={msg.sender === "user"}
              />
            ))}
            {loading && (
              <motion.div
                key="ai-typing"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150 } }}
                exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.16 } }}
                className="w-full flex justify-start py-1 px-0"
              >
                <div className="flex items-center max-w-3xl">
                  <Bot className="w-8 h-8 mr-3 p-1 bg-cyan-800/80 border border-cyan-700 rounded-full text-cyan-300 shadow-sm" strokeWidth={2} />
                  <div className="rounded-xl px-5 py-3 text-base font-medium bg-slate-800/90 text-indigo-100 min-w-[120px] border border-slate-700 flex items-center">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin text-cyan-300" />
                    <span>
                      AI is typing
                      <span className="inline-block animate-bounce1 ml-0.5">.</span>
                      <span className="inline-block animate-bounce2 ml-0.5">.</span>
                      <span className="inline-block animate-bounce3 ml-0.5">.</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Gradient overlay at bottom for better UX, ChatGPT style */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10"
          style={{
            background: "linear-gradient(0deg, #0f172a 88%, rgba(255,255,255,0) 100%)"
          }} />
      </section>

      {/* Input Bar */}
      <form
        className="w-full max-w-3xl mt-0 pb-8 px-0 sm:px-4 flex items-end gap-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
        autoComplete="off"
      >
        <div className="flex-1 relative">
          <input
            className="w-full text-base bg-slate-900/95 border border-slate-700 focus:border-cyan-500/80 transition-all text-indigo-100 rounded-xl px-5 py-3 shadow-sm placeholder:text-slate-400 outline-none
            focus:bg-slate-900/98"
            type="text"
            name="prompt"
            autoComplete="off"
            placeholder="Message AI Career Coach…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
            spellCheck={false}
            aria-label="Chat message input"
          />
        </div>
        <motion.button
          className="flex items-center gap-1 px-4 py-3 rounded-xl font-semibold transition
            bg-gradient-to-br from-cyan-500/90 to-indigo-700/90
            text-white shadow-md border border-cyan-700/40
            hover:brightness-105 active:scale-95 disabled:opacity-50 ml-1"
          type="submit"
          disabled={loading || !input.trim()}
          whileTap={{ scale: 0.96 }}
        >
          <SendHorizonal className="w-5 h-5 mr-1 -ml-1" strokeWidth={2.2} />
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </form>
      {/* Animations and Styles */}
      <style>{`
        /* Bubble shadow on hover for both user & ai */
        .chat-bubble:hover {
          box-shadow: 0px 8px 30px 0px rgba(72,202,228,0.12), 0px 2px 16px 0px rgba(79,70,229,0.11);
        }
        .animate-bounce1 { animation: bounce1 1.25s infinite; }
        .animate-bounce2 { animation: bounce2 1.25s infinite; }
        .animate-bounce3 { animation: bounce3 1.25s infinite; }
        @keyframes bounce1 { 0%, 80%, 100% {transform: translateY(0);} 34% {transform: translateY(-9px);} }
        @keyframes bounce2 { 0%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-11px);} }
        @keyframes bounce3 { 0%, 80%, 100% {transform: translateY(0);} 46% {transform: translateY(-7px);} }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .chat-scroll {
          scroll-behavior: smooth;
        }
        /* Input focus style */
        input:focus-visible {
          outline: 2px solid #67e8f9;
        }
        .animate-spin-slow {
          animation: spin 2.3s linear infinite;
        }
        @media (max-width: 600px) {
          .max-w-3xl { max-width: 100vw !important; }
          .w-full { width: 98vw !important; }
          .px-5 { padding-left: 1.1rem; padding-right: 1.1rem; }
        }
      `}</style>
    </main>
  );
}

export default AIChat
