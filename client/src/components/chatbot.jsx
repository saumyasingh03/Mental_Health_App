import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

/**
 * ChatBot (dark / machine theme)
 * - Uses TailwindCSS classes (make sure Tailwind is configured)
 * - Auto-scrolls to bottom, supports Enter to send, shows loading state
 * - Keeps the same backend call you used (http://127.0.0.1:8000/chat)
 */
const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]); // { type: "user"|"bot", text, time }
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Send handler
  const handleSend = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMsg = { type: "user", text: trimmed, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        new URLSearchParams({ prompt: trimmed }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const botReply = res?.data?.reply ?? "No reply from server.";
      const botMsg = { type: "bot", text: botReply, time: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error: Unable to get a reply. Try again.", time: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setLoading(false);
      // focus input after response
      inputRef.current?.focus();
    }
  };

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl ring-1 ring-indigo-700/30 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-900/40 to-transparent border-b border-indigo-700/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md">
            M
          </div>
          <div>
            <div className="text-sm font-semibold text-indigo-200">Mentor AI</div>
            <div className="text-xs text-indigo-300/60">Chat with a mentor-style assistant</div>
          </div>
        </div>

        <div className="text-xs text-indigo-300/70 flex items-center gap-3">
          <div className="px-2 py-1 rounded-md bg-indigo-700/20 text-indigo-200">Machine Mode</div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="p-4 h-80 md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600/40 scrollbar-track-transparent">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-indigo-300/60 italic">Say hi to start the conversation — ask anything.</div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.type === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] break-words p-3 rounded-lg shadow-sm ${isUser ? "bg-gradient-to-r from-indigo-700/80 to-indigo-600/80 text-white rounded-br-none" : "bg-gray-900/60 text-gray-100 rounded-bl-none border border-indigo-700/10"}`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                  <div className="text-[11px] text-indigo-200/60 mt-1 text-right">{msg.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-gradient-to-t from-black/20 to-transparent border-t border-indigo-700/20">
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <div className="flex gap-3 items-center">
          <textarea
            id="chat-input"
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message — press Enter to send (Shift+Enter for newline)"
            className="flex-1 resize-none min-h-[44px] max-h-32 px-4 py-3 rounded-xl bg-gray-900/70 placeholder-indigo-300/40 text-gray-100 outline-none border border-indigo-700/20 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg font-medium shadow-md transform transition active:scale-95
                ${loading || !prompt.trim()
                  ? "bg-indigo-600/40 cursor-not-allowed text-indigo-200"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500"}
              `}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>Thinking…</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Send</span>
                </>
              )}
            </button>

            <button
              onClick={() => { setPrompt(""); inputRef.current?.focus(); }}
              className="px-3 py-2 rounded-lg bg-transparent border border-indigo-700/20 text-indigo-200 hover:bg-indigo-700/10"
              title="Clear"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
