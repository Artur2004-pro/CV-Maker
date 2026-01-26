import type { Rect } from "./geometry";
import { SNAP, BREAK, type SnapGuide } from "./snap";

type Handle =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export function resizeSnap(
  rect: Rect,
  handle: Handle,
  dx: number,
  dy: number,
  others: Rect[],
  pageWidth: number,
  pageHeight: number,
): { rect: Rect; guides: SnapGuide[] } {
  let next: Rect = { ...rect };
  const guides: SnapGuide[] = [];

  const affectsX = handle.includes("left") || handle.includes("right");
  const affectsY = handle.includes("top") || handle.includes("bottom");

  // ---------- X AXIS ----------
  if (affectsX) {
    const isLeft = handle.includes("left");

    const edgeX = isLeft ? rect.x + dx : rect.x + rect.width + dx;

    const candidates = [
      ...others.flatMap((o) => [o.x, o.x + o.width, o.x + o.width / 2]),
      0,
      pageWidth / 2,
      pageWidth,
    ];

    let best: { diff: number; value: number } | null = null;

    for (const c of candidates) {
      const diff = edgeX - c;
      if (
        Math.abs(diff) < SNAP &&
        (!best || Math.abs(diff) < Math.abs(best.diff))
      ) {
        best = { diff: -diff, value: c };
      }
    }

    const snapDx = best && Math.abs(dx) < BREAK ? best.diff : 0;

    if (isLeft) {
      next.x = Math.max(rect.x + dx + snapDx, 0);
      next.width = rect.width - dx - snapDx;
    } else {
      next.width = rect.width + dx + snapDx;
    }

    if (best) guides.push({ axis: "x", value: best.value });
  }

  // ---------- Y AXIS ----------
  if (affectsY) {
    const isTop = handle.includes("top");

    const edgeY = isTop ? rect.y + dy : rect.y + rect.height + dy;

    const candidates = [
      ...others.flatMap((o) => [o.y, o.y + o.height, o.y + o.height / 2]),
      0,
      pageHeight / 2,
      pageHeight,
    ];

    let best: { diff: number; value: number } | null = null;

    for (const c of candidates) {
      const diff = edgeY - c;
      if (
        Math.abs(diff) < SNAP &&
        (!best || Math.abs(diff) < Math.abs(best.diff))
      ) {
        best = { diff: -diff, value: c };
      }
    }

    const snapDy = best && Math.abs(dy) < BREAK ? best.diff : 0;

    if (isTop) {
      next.y = Math.max(rect.y + dy + snapDy, 0);
      next.height = rect.height - dy - snapDy;
    } else {
      next.height = rect.height + dy + snapDy;
    }

    if (best) guides.push({ axis: "y", value: best.value });
  }

  // ---------- LIMITS ----------
  next.width = Math.max(24, Math.min(next.width, pageWidth - next.x));
  next.height = Math.max(24, Math.min(next.height, pageHeight - next.y));
  next.x = Math.max(0, Math.min(next.x, pageWidth - next.width));
  next.y = Math.max(0, Math.min(next.y, pageHeight - next.height));

  return { rect: next, guides };
}
