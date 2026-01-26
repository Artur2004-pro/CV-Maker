import type { SnapGuide } from "./snap";

export type InteractionState = {
  mode: "idle" | "drag" | "resize";
  blockId: string | null;
  guides: SnapGuide[];
  resizeHandle?: "left" | "right" | "top" | "bottom";
};
