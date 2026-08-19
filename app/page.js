export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>StreamWidget Live Aktif</h1>
      <p style={{ color: "#888", marginBottom: "1.5rem" }}>Yayıncılar için canlı overlay katmanı.</p>
      <a href="/widget" style={{ padding: "10px 20px", backgroundColor: "#fff", color: "#000", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
        Widget Sayfasına Git
      </a>
    </main>
  );
}
