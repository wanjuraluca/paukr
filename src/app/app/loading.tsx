import { Skel, SkelPage, SkelHeader } from "@/components/Skeleton";

// Mirrors the dashboard layout in AppClient, so the real screen drops in
// without the page jumping around.
export default function Loading() {
  return (
    <SkelPage>
      <SkelHeader />
      <main style={{ maxWidth: "1160px", margin: "0 auto", padding: "64px 28px 90px" }}>
        <div style={{ marginBottom: "44px" }}>
          <Skel w={190} h={16} />
          <Skel w="min(420px, 80%)" h={46} r={12} style={{ margin: "14px 0 16px" }} />
          <Skel w="min(560px, 95%)" h={16} />
          <Skel w="min(430px, 75%)" h={16} style={{ marginTop: "8px" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "22px",
                padding: "26px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <Skel w={52} h={52} r={15} />
                <Skel w={62} h={24} r={100} />
              </div>
              <Skel w="70%" h={22} style={{ marginBottom: "10px" }} />
              <Skel w="90%" h={15} style={{ marginBottom: "26px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <Skel w={110} h={13} />
                <Skel w={30} h={13} />
              </div>
              <Skel h={7} r={100} />
            </div>
          ))}
        </div>
      </main>
    </SkelPage>
  );
}
