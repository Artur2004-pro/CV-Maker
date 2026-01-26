import { type Rect, rectEdges } from "./geometry";

export type SnapGuide = { axis: "x" | "y"; value: number };

export const SNAP = 6;
export const BREAK = 14;

// Drag snapping
export function snapRect(
  moving: Rect,
  others: Rect[],
  pageWidth: number,
  pageHeight: number,
): { rect: Rect; guides: SnapGuide[] } {
  let dx: number | null = null;
  let dy: number | null = null;
  let snapX: number | null = null;
  let snapY: number | null = null;
  const m = rectEdges(moving);

  for (const o of others) {
    const e = rectEdges(o);

    // X axis
    for (const [a, b] of [
      [m.left, e.left],
      [m.left, e.right],
      [m.centerX, e.centerX],
      [m.right, e.left],
      [m.right, e.right],
    ]) {
      const diff = b - a;
      if (
        Math.abs(diff) < SNAP &&
        (dx === null || Math.abs(diff) < Math.abs(dx))
      ) {
        dx = diff;
        snapX = b;
      }
    }

    // Y axis
    for (const [a, b] of [
      [m.top, e.top],
      [m.top, e.bottom],
      [m.centerY, e.centerY],
      [m.bottom, e.top],
      [m.bottom, e.bottom],
    ]) {
      const diff = b - a;
      if (
        Math.abs(diff) < SNAP &&
        (dy === null || Math.abs(diff) < Math.abs(dy))
      ) {
        dy = diff;
        snapY = b;
      }
    }
  }

  // Snap to page edges
  const pageEdgesX = [0, pageWidth / 2, pageWidth];
  for (const edge of pageEdgesX) {
    const diff = m.left - edge;
    if (Math.abs(diff) < SNAP) dx = -diff;
  }
  const pageEdgesY = [0, pageHeight / 2, pageHeight];
  for (const edge of pageEdgesY) {
    const diff = m.top - edge;
    if (Math.abs(diff) < SNAP) dy = -diff;
  }

  const next: Rect = { ...moving };
  if (dx !== null) next.x += dx;
  if (dy !== null) next.y += dy;

  // Clamp
  next.x = Math.max(0, Math.min(next.x, pageWidth - next.width));
  next.y = Math.max(0, Math.min(next.y, pageHeight - next.height));

  const guides: SnapGuide[] = [];
  if (snapX !== null) guides.push({ axis: "x", value: snapX });
  if (snapY !== null) guides.push({ axis: "y", value: snapY });

  return { rect: next, guides };
}
