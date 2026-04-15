"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  createChat,
  logOut,
  updateChat,
  watchAuth,
  type ChatMessage,
  type ChatMode,
} from "@/lib/firebase";
import type { User } from "firebase/auth";

function BotAvatar() {
  return (
    <div className="sz-bot-wrap">
      <div className="sz-bot-glow" />
      <div className="sz-bot-avatar">
        <div className="sz-bot-head">
          <div className="sz-bot-eye left" />
          <div className="sz-bot-eye right" />
          <div className="sz-bot-mouth" />
        </div>
        <div className="sz-bot-body">
          <div className="sz-bot-core" />
        </div>
        <div className="sz-bot-ring ring-1" />
        <div className="sz-bot-ring ring-2" />
      </div>
    </div>
  );
}

export default function ChatUI() {
  const [mode, setMode] = useState<ChatMode>("general");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = watchAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const saveConversation = async (allMessages: ChatMessage[]) => {
    if (!user || allMessages.length === 0) return;

    const title = allMessages[0]?.content.slice(0, 50) || "New chat";

    if (!chatId) {
      const newId = await createChat({
        userId: user.uid,
        userName: user.displayName || "Student",
        userEmail: user.email || "",
        title,
        mode,
        messages: allMessages,
      });
      setChatId(newId);
    } else {
      await updateChat(chatId, {
        title,
        mode,
        messages: allMessages,
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveConversation(finalMessages);
    } catch (error) {
      const assistantError: ChatMessage = {
        role: "assistant",
        content:
          error instanceof Error
            ? `Error: ${error.message}`
            : "Error: Something went wrong.",
      };

      const finalMessages = [...updatedMessages, assistantError];
      setMessages(finalMessages);
      await saveConversation(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setChatId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getModeTitle = () => {
    if (mode === "study") return "Study mode";
    if (mode === "news") return "News mode";
    return "General mode";
  };

  const getModeDescription = () => {
    if (mode === "study") {
      return "Concept explanations, homework help, coding support, summaries, and revision help.";
    }
    if (mode === "news") {
      return "Current world news and simplified updates for students.";
    }
    return "Ask broad questions about life, knowledge, productivity, career, and daily learning.";
  };

  return (
    <div className="sz-page">
      <div className="sz-bg-orb orb-1" />
      <div className="sz-bg-orb orb-2" />
      <div className="sz-bg-orb orb-3" />

      <div className="sz-shell">
        <div className="sz-hero">
          <div className="sz-hero-left">
            <div className="sz-badge">AI Student Assistant</div>
            <h1 className="sz-title">Super Zack</h1>
            <p className="sz-subtitle">
              Study help, coding support, general learning, and world knowledge — all in one smart student assistant.
            </p>

            {user && (
              <div className="sz-user-topbar">
                <div className="sz-user-menu-wrap">
                  <button
                    type="button"
                    className="sz-user-menu-btn"
                    onClick={() => setOpenMenu((prev) => !prev)}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="sz-user-top-avatar"
                      />
                    ) : (
                      <div className="sz-user-top-avatar sz-user-top-avatar-fallback">
                        {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="sz-user-top-text">
                      <div className="sz-user-top-name">{user.displayName || "Student User"}</div>
                      <div className="sz-user-top-email">{user.email || ""}</div>
                    </div>
                  </button>

                  {openMenu && (
                    <div className="sz-user-dropdown">
                      <Link href="/history" className="sz-user-dropdown-item">
                        View history
                      </Link>
                      <button
                        type="button"
                        className="sz-user-dropdown-item sz-user-dropdown-button"
                        onClick={logOut}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="sz-hero-stats">
              <div className="sz-stat-card">
                <span className="sz-stat-number">24/7</span>
                <span className="sz-stat-label">Available</span>
              </div>
              <div className="sz-stat-card">
                <span className="sz-stat-number">3</span>
                <span className="sz-stat-label">Smart modes</span>
              </div>
              <div className="sz-stat-card">
                <span className="sz-stat-number">∞</span>
                <span className="sz-stat-label">Questions</span>
              </div>
            </div>
          </div>

          <div className="sz-hero-right">
            <BotAvatar />
          </div>
        </div>

        <div className="sz-grid">
          <aside className="sz-sidebar">
            <div className="sz-sidebar-card">
              <h2 className="sz-section-title">Choose a mode</h2>

              <button
                onClick={() => setMode("study")}
                className={`sz-mode-btn ${mode === "study" ? "active" : ""}`}
              >
                <div className="sz-mode-head">📘 Study mode</div>
                <div className="sz-mode-text">
                  Homework help, concept explanation, revision, coding support, and summaries.
                </div>
              </button>

              <button
                onClick={() => setMode("news")}
                className={`sz-mode-btn ${mode === "news" ? "active" : ""}`}
              >
                <div className="sz-mode-head">🌍 News mode</div>
                <div className="sz-mode-text">
                  Simplified current affairs and world updates in student-friendly language.
                </div>
              </button>

              <button
                onClick={() => setMode("general")}
                className={`sz-mode-btn ${mode === "general" ? "active" : ""}`}
              >
                <div className="sz-mode-head">🧠 General mode</div>
                <div className="sz-mode-text">
                  Ask broad questions about life, productivity, career, and daily learning.
                </div>
              </button>

              <Link
                href="/history"
                className="sz-send-btn"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 10,
                  height: 48,
                }}
              >
                View history
              </Link>

              <button onClick={clearChat} className="sz-clear-btn">
                New chat
              </button>

              <button onClick={logOut} className="sz-mode-btn" style={{ marginTop: 10 }}>
                <div className="sz-mode-head">🚪 Logout</div>
                <div className="sz-mode-text">Sign out from this student account.</div>
              </button>
            </div>

            <div className="sz-sidebar-note">
              <h3>Why students will like it</h3>
              <p>
                Fast answers, saved conversations, and cleaner explanations than a plain search box.
              </p>
            </div>
          </aside>

          <main className="sz-chat-panel">
            <div className="sz-chat-header">
              <div>
                <h2 className="sz-chat-title">{getModeTitle()}</h2>
                <p className="sz-chat-desc">{getModeDescription()}</p>
              </div>
              <div className="sz-status">
                <span className="sz-status-dot" />
                Online
              </div>
            </div>

            <div className="sz-chat-body">
              {messages.length === 0 ? (
                <div className="sz-empty-state">
                  <BotAvatar />
                  <h3>Start chatting with Super Zack</h3>
                  <p>
                    Ask anything about your studies, coding, productivity, or world topics.
                  </p>

                  <div className="sz-suggestions">
                    <button onClick={() => setInput("Explain database normalization simply.")}>
                      Explain database normalization
                    </button>
                    <button onClick={() => setInput("Summarize today's major world news.")}>
                      Summarize major world news
                    </button>
                    <button onClick={() => setInput("Help me make a study plan for exams.")}>
                      Make me a study plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sz-messages">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`sz-message-row ${message.role === "user" ? "user" : "assistant"}`}
                    >
                      <div className={`sz-message ${message.role}`}>
                        <div className="sz-message-label">
                          {message.role === "user" ? "You" : "Super Zack"}
                        </div>
                        <div className="sz-message-content">{message.content}</div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="sz-message-row assistant">
                      <div className="sz-message assistant">
                        <div className="sz-message-label">Super Zack</div>
                        <div className="sz-typing">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="sz-input-area">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Super Zack anything about study, coding, or world knowledge..."
                className="sz-textarea"
              />
              <button onClick={sendMessage} disabled={loading || !user} className="sz-send-btn">
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            <div className="sz-footer-note">
              Press <strong>Enter</strong> to send · <strong>Shift + Enter</strong> for new line
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}