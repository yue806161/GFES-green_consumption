import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "綠色消費平台",
    template: "%s｜綠色消費平台",
  },
  description: "把消費、低碳交通與電子帳單化為綠點，優先支持附近小農，形成可追溯的地方永續循環。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
