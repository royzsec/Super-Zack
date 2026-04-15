import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Zack",
  description: "AI student assistant built with Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}