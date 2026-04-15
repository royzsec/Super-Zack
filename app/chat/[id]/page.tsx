"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/auth-guard";
import { getChat, type ChatRecord } from "@/lib/firebase";

function ChatView() {
  const params = useParams<{ id: string }>();
  const [chat, setChat] = useState<ChatRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getChat(params.id);
      setChat(data);
      setLoading(false);
    };

    load();
  }, [params.id]);

  return (
    <div className="sz-page">
      <div className="sz-shell">

        {/* 🔥 BACK BUTTON */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/history"
            className="sz-send-btn"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 42,
              padding: "0 16px"
            }}
          >
            ← Back to History
          </Link>
        </div>

        <div className="sz-chat-panel">
          <div className="sz-chat-header">
            <div>
              <h2 className="sz-chat-title">Saved Conversation</h2>
              <p className="sz-chat-desc">Review a previous chat.</p>
            </div>
          </div>

          <div className="sz-chat-body">
            {loading ? (
              <p>Loading chat...</p>
            ) : !chat ? (
              <p>Chat not found.</p>
            ) : (
              <div className="sz-messages">
                {chat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`sz-message-row ${
                      message.role === "user" ? "user" : "assistant"
                    }`}
                  >
                    <div className={`sz-message ${message.role}`}>
                      <div className="sz-message-label">
                        {message.role === "user" ? "You" : "Super Zack"}
                      </div>
                      <div className="sz-message-content">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatDetailsPage() {
  return (
    <AuthGuard>
      <ChatView />
    </AuthGuard>
  );
}