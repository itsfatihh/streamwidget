import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamWidget - Modern Canlı Yayın Widget Kütüphanesi",
  description: "OBS ve Streamlabs için ücretsiz, şeffaf ve özelleştirilebilir overlay katmanları.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-[#090b10] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
