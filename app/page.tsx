export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
      <p
        className="text-sm mb-4"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--smoke)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Research-grade cyclone tracking
      </p>
      <h1
        className="text-6xl text-center leading-tight mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
      >
        Storm Tracker
      </h1>
      <div className="flex gap-4">
        <a
          href="/live"
          className="px-6 py-3 text-sm font-semibold rounded"
          style={{
            backgroundColor: "var(--rust)",
            color: "var(--cream)",
            fontFamily: "var(--font-body)",
          }}
        >
          Live Storms
        </a>
        <a
          href="/library"
          className="px-6 py-3 text-sm font-semibold rounded border"
          style={{
            borderColor: "var(--ink-600)",
            color: "var(--smoke)",
            fontFamily: "var(--font-body)",
          }}
        >
          Storm Library
        </a>
      </div>
    </main>
  );
}
