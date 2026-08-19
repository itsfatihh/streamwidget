import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamWidget Live",
  description: "Yayıncılar için canlı widget katmanı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-transparent antialiased">{children}</body>
    </html>
  );
}
