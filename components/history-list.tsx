"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserChats, removeChat, watchAuth, type ChatRecord } from "@/lib/firebase";

export default function HistoryList() {
  const [items, setItems] = useState<ChatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChats = async (userId: string) => {
    try {
      setLoading(true);
      setError("");

      const chats = await getUserChats(userId);
      setItems(chats);
    } catch (err) {
      console.error("History load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = watchAuth((user) => {
      if (user) {
        loadChats(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleDelete = async (chatId: string) => {
    try {
      await removeChat(chatId);
      setItems((prev) => prev.filter((item) => item.id !== chatId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete chat.");
    }
  };

  return (
    <div className="sz-chat-panel" style={{ minHeight: 500 }}>
      <div className="sz-chat-header">
        <div>
          <h2 className="sz-chat-title">Chat History</h2>
          <p className="sz-chat-desc">Open a previous conversation anytime.</p>
        </div>
      </div>

      <div className="sz-chat-body">
        {loading ? (
          <p>Loading history...</p>
        ) : error ? (
          <p style={{ color: "#fca5a5" }}>Error: {error}</p>
        ) : items.length === 0 ? (
          <p>No saved chats yet.</p>
        ) : (
          <div className="sz-messages">
            {items.map((item) => (
              <div
                key={item.id}
                className="sz-message assistant"
                style={{ maxWidth: "100%" }}
              >
                <div className="sz-message-label">{item.mode.toUpperCase()}</div>
                <div className="sz-message-content" style={{ marginBottom: 12 }}>
                  {item.title}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <Link
                    href={`/chat/${item.id}`}
                    className="sz-send-btn"
                    style={{
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 100,
                      height: 42,
                    }}
                  >
                    Open
                  </Link>

                  <button
                    className="sz-clear-btn"
                    style={{
                      minWidth: 100,
                      width: "auto",
                      marginTop: 0,
                      padding: "10px 16px",
                    }}
                    onClick={() => handleDelete(item.id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}