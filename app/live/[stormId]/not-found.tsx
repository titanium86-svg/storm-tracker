import EmptyState from "@/components/ui/EmptyState";

export default function StormNotFound() {
  return (
    <main className="flex-1">
      <EmptyState
        title="Storm not found"
        description="This storm may no longer be active or the ID is incorrect."
        cta={{ label: "Back to Live", href: "/live" }}
      />
    </main>
  );
}
