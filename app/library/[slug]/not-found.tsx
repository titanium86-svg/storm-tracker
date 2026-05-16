import EmptyState from "@/components/ui/EmptyState";

export default function StormLibraryNotFound() {
  return (
    <main className="flex-1">
      <EmptyState
        title="Storm not found"
        description="This storm is not in the library yet."
        cta={{ label: "Browse Library", href: "/library" }}
      />
    </main>
  );
}
