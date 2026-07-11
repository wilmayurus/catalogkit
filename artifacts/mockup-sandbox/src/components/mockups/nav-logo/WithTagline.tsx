export function WithTagline() {
  return (
    <div style={{ fontFamily: "'Lexend', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "flex-start" }}>
      <nav style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "11px", textDecoration: "none" }}>
          <img src="/__mockup/images/catalogkit-logo.png" alt="CatalogKit" style={{ height: "40px", width: "auto", display: "block" }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1px" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1 }}>CatalogKit</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "#f97316", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1 }}>Digital Catalogs for PNG</span>
          </div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="#" style={{ color: "#0f172a", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Catalogs</a>
          <a href="#" style={{ color: "#0f172a", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Profile</a>
          <a href="#" style={{ color: "#0f172a", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Help</a>
          <a href="#" style={{ background: "#f97316", color: "#fff", padding: "8px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Sign out</a>
        </div>
      </nav>
    </div>
  );
}
