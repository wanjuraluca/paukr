import { Skel, SkelPage } from "@/components/Skeleton";

// Matches the two-column pricing layout of UpgradeClient.
export default function Loading() {
  return (
    <SkelPage>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: "880px", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
            <Skel w="min(420px, 90%)" h={38} r={12} />
            <Skel w="min(340px, 80%)" h={17} style={{ marginTop: "14px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  background: "var(--surface)",
                  padding: "28px",
                }}
              >
                <Skel w={70} h={20} />
                <Skel w={130} h={32} r={10} style={{ margin: "12px 0 22px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[0, 1, 2].map((k) => (
                    <Skel key={k} w={`${88 - k * 11}%`} h={14} />
                  ))}
                </div>
                {i === 1 && <Skel h={46} r={12} style={{ marginTop: "24px" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkelPage>
  );
}
