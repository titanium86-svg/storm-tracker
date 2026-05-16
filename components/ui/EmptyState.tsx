import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
};

export default function EmptyState({ title, description, cta }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full mb-6 flex items-center justify-center"
        style={{ backgroundColor: "var(--ink-700)", border: "1px solid var(--ink-600)" }}
      >
        <span style={{ color: "var(--ash)", fontSize: "20px" }}>⚡</span>
      </div>
      <h2
        className="text-xl mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="text-sm max-w-xs mb-6"
          style={{ color: "var(--smoke)", fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="px-5 py-2 rounded text-sm font-medium"
          style={{
            backgroundColor: "var(--ink-600)",
            color: "var(--cream)",
            fontFamily: "var(--font-body)",
          }}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
