import Link from "next/link";
import AuthGuard from "@/components/auth-guard";
import HistoryList from "@/components/history-list";

export default function HistoryPage() {
  return (
    <AuthGuard>
      <div className="sz-page">
        <div className="sz-shell">

          {/* 🔥 BACK BUTTON */}
          <div style={{ marginBottom: 20 }}>
            <Link
              href="/"
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
              ← Back to Chat
            </Link>
          </div>

          <HistoryList />
        </div>
      </div>
    </AuthGuard>
  );
}