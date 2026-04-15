"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, watchAuth } from "@/lib/firebase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = watchAuth((user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sz-page">
      <div className="sz-shell">
        <div className="sz-hero" style={{ maxWidth: 720, margin: "80px auto 0" }}>
          <div className="sz-badge">Welcome to Super Zack</div>
          <h1 className="sz-title">Sign in as a student</h1>
          <p className="sz-subtitle">
            Use Google login to save your chats, open your previous conversations,
            and continue learning anytime.
          </p>

          <div style={{ marginTop: 24 }}>
            <button className="sz-send-btn" onClick={handleGoogleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Continue with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}