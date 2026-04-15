"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { watchAuth } from "@/lib/firebase";
import type { User } from "firebase/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsub = watchAuth((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/login");
      }
    });

    return () => unsub();
  }, [router]);

  if (user === undefined) {
    return (
      <div className="sz-page">
        <div className="sz-shell">
          <div className="sz-hero">
            <h1 className="sz-title">Checking your account...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}