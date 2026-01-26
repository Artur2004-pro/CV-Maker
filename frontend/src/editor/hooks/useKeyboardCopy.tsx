import { useEffect } from "react";
import type { Block } from "../types";

export function useKeyboardCopy(
  selectedId: string | null,
  blocks: Block[],
  setBlocks: (updater: (prev: Block[]) => Block[]) => void,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "c" &&
        selectedId
      ) {
        const blockToCopy = blocks.find((b) => b.id === selectedId);
        if (blockToCopy) {
          const newBlock = {
            ...blockToCopy,
            id: crypto.randomUUID(),
            x: blockToCopy.x + 20,
            y: blockToCopy.y + 20,
          };
          setBlocks((prev) => [...prev, newBlock]);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, blocks, setBlocks]);
}
