import AuthGuard from "@/components/auth-guard";
import ChatUI from "@/components/chat-ui";

export default function HomePage() {
  return (
    <AuthGuard>
      <ChatUI />
    </AuthGuard>
  );
}