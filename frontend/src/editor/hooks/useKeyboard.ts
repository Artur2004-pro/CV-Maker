import { useEffect } from "react";

export function useKeyboardDelete(
  selectedId: string | null,
  removeBlock: (id: string) => void,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) removeBlock(selectedId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, removeBlock]);
}
