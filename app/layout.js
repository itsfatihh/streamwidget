import "./globals.css";

export const metadata = {
  title: "StreamWidget Live",
  description: "Canlı Yayın Widget Katmanı",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, padding: 0, backgroundColor: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
