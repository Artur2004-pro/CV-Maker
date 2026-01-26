import { Rnd } from "react-rnd";
import { useEditor } from "../../editor/EditorContext";
import { snapRect } from "../../editor/core/snap";
import { resizeSnap } from "../../editor/core/resize";
import { TextBlock } from "./TextBlock";
import type { Block } from "../../editor/types";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

// Normalize corner handles to side handles
// function normalizeHandle(dir: string): "top" | "bottom" | "left" | "right" {
//   if (dir.includes("top")) return "top";
//   if (dir.includes("bottom")) return "bottom";
//   if (dir.includes("left")) return "left";
//   return "right";
// }

export function BlockWrapper({ block }: { block: Block }) {
  const { blocks, setBlocks, selectedId, setSelectedId, setInteraction } =
    useEditor();
  const others = blocks.filter((b) => b.id !== block.id);
  const isSelected = selectedId === block.id;

  // Drag handler
  const handleDrag = (_e: any, data: any) => {
    const { rect, guides } = snapRect(
      { ...block, x: data.x, y: data.y },
      others,
      PAGE_WIDTH,
      PAGE_HEIGHT,
    );

    // Clamp to page bounds
    rect.x = Math.max(0, Math.min(rect.x, PAGE_WIDTH - rect.width));
    rect.y = Math.max(0, Math.min(rect.y, PAGE_HEIGHT - rect.height));

    setBlocks((bs) =>
      bs.map((b) => (b.id === block.id ? { ...b, ...rect } : b)),
    );
    setInteraction({ guides, mode: "drag", blockId: block.id });
  };

  const handleDragStop = () =>
    setInteraction({ guides: [], mode: "idle", blockId: null });

  // Resize handler
  const handleResize = (
    _e: any,
    dir: string,
    ref: HTMLElement,
    _delta: any,
    position: { x: number; y: number },
  ) => {
    const dx = dir.includes("left")
      ? position.x - block.x
      : ref.offsetWidth - block.width;

    const dy = dir.includes("top")
      ? position.y - block.y
      : ref.offsetHeight - block.height;

    const { rect, guides } = resizeSnap(
      block,
      dir as any,
      dx,
      dy,
      others,
      PAGE_WIDTH,
      PAGE_HEIGHT,
    );

    setBlocks((bs) =>
      bs.map((b) => (b.id === block.id ? { ...b, ...rect } : b)),
    );

    setInteraction({ guides, mode: "resize", blockId: block.id });
  };

  const handleResizeStop = () =>
    setInteraction({ guides: [], mode: "idle", blockId: null });

  return (
    <Rnd
      size={{ width: block.width, height: block.height }}
      position={{ x: block.x, y: block.y }}
      onClick={() => setSelectedId(block.id)}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      enableResizing={{
        top: true,
        bottom: true,
        left: true,
        right: true,
        topRight: true,
        topLeft: true,
        bottomRight: true,
        bottomLeft: true,
      }}
      style={{
        border: isSelected ? "2px solid #2563eb" : "1px solid #d1d5db",
        borderRadius: block.borderRadius,
        background: block.backgroundColor,
        position: "absolute",
        transition: "border 0.1s ease",
        boxShadow: isSelected ? "0 0 6px rgba(37,99,235,0.3)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: block.backgroundColor,
          borderRadius: block.borderRadius,
        }}
      >
        {isSelected && (
          <button
            onClick={() => {
              setBlocks((bs) => bs.filter((b) => b.id !== block.id));
              setSelectedId(null);
            }}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            ✕
          </button>
        )}
        <TextBlock block={block} />
      </div>
    </Rnd>
  );
}
