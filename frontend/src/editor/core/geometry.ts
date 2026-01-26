export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function rectEdges(rect: Rect) {
  return {
    left: rect.x,
    right: rect.x + rect.width,
    top: rect.y,
    bottom: rect.y + rect.height,
    centerX: rect.x + rect.width / 2,
    centerY: rect.y + rect.height / 2,
  };
}
