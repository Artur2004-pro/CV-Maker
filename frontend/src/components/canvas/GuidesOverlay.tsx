import { type SnapGuide } from "../../editor/core/snap";

export function GuidesOverlay({ guides }: { guides: SnapGuide[] }) {
  return (
    <>
      {guides.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: g.axis === "x" ? g.value : 0,
            top: g.axis === "y" ? g.value : 0,
            width: g.axis === "x" ? 1 : "100%",
            height: g.axis === "y" ? 1 : "100%",
            background: "#2563eb",
            pointerEvents: "none",
            zIndex: 999,
          }}
        />
      ))}
    </>
  );
}
