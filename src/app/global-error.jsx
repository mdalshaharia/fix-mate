"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f6f6f6",
          color: "#111",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
            The app hit an unexpected error. Please reload the page, and if it
            keeps happening check the server logs.
          </p>
          {error?.digest && (
            <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
              Error reference: <code>{error.digest}</code>
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 8,
              background: "#E64833",
              color: "white",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
