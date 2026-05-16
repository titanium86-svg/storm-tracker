import StormMapLoader from "@/components/map/StormMapLoader";

export default function LivePage() {
  return (
    <main
      className="flex-1 flex flex-col"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <StormMapLoader />
    </main>
  );
}
