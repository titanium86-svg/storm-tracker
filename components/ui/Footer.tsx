export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-4"
      style={{
        borderColor: "var(--ink-600)",
        backgroundColor: "var(--ink-800)",
      }}
    >
      <p
        className="text-xs text-center"
        style={{ color: "var(--ash)", fontFamily: "var(--font-body)" }}
      >
        Storm data: NOAA National Hurricane Center · Satellite: NASA EOSDIS GIBS ·
        Map: MapLibre + OpenStreetMap
      </p>
    </footer>
  );
}
