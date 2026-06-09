import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CafeAlarm Console",
  description: "네이버 카페 Discord 알림 관리자 콘솔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
