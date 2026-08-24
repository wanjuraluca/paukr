import { Skel, SkelPage } from "@/components/Skeleton";

// The review list pulls every question including drafts, so it is the slowest
// page in the app and benefits most from a placeholder.
export default function Loading() {
  return (
    <SkelPage>
      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "56px 24px 90px" }}>
        <Skel w="min(300px, 70%)" h={34} r={12} />
        <Skel w="min(460px, 90%)" h={16} style={{ marginTop: "14px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", margin: "32px 0" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <Skel w={72} h={13} />
              <Skel w={44} h={22} style={{ marginTop: "10px" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <Skel w={74} h={22} r={100} />
                <Skel w={96} h={22} r={100} />
                <Skel w={112} h={22} r={100} />
              </div>
              <Skel w="94%" h={17} />
              <Skel w="62%" h={17} style={{ marginTop: "9px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginTop: "20px" }}>
                {[0, 1, 2, 3].map((k) => (
                  <Skel key={k} w={`${82 - k * 9}%`} h={14} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </SkelPage>
  );
}
