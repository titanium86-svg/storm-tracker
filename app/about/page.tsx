export default function AboutPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-16">
      <h1
        className="text-4xl mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
      >
        About
      </h1>
      <p style={{ color: "var(--bone)", fontFamily: "var(--font-body)" }}>
        Storm Tracker is a research-grade tropical cyclone monitoring platform,
        inspired by NASA Earth Observatory and built for those who want to
        understand storms, not just track them.
      </p>
    </main>
  );
}
