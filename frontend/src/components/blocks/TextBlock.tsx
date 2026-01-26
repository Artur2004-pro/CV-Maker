import React from "react";
import { type Block } from "../editor/types";
import { useEditor } from "../../editor/EditorContext";

export const TextBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { selectedId, setSelectedId } = useEditor();
  const isSelected = selectedId === block.id;

  return (
    <div
      onClick={() => setSelectedId(block.id)}
      style={{
        padding: 10,
        margin: 5,
        border: isSelected ? "2px solid blue" : "1px solid #ccc",
        borderRadius: block.borderRadius || 4,
        fontSize: block.fontSize || 16,
        color: block.textColor || "#000",
        background: block.backgroundColor || "#fff",
        cursor: "pointer",
      }}
    >
      {block.content}
    </div>
  );
};
