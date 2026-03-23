import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 背景去除工具",
  description: "在线一键去除图片背景，无需安装软件",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
