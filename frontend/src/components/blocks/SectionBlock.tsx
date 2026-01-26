import React from "react";
import { type Block } from "../editor/types";
import { useEditor } from "../../editor/EditorContext";

export const SectionBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { selectedId, setSelectedId } = useEditor();
  const isSelected = selectedId === block.id;

  return (
    <section
      onClick={() => setSelectedId(block.id)}
      style={{
        padding: 15,
        margin: 10,
        border: isSelected ? "2px solid green" : "1px solid #aaa",
        borderRadius: block.borderRadius || 8,
        background: block.backgroundColor || "#f0f0f0",
      }}
    >
      <h3>{block.content}</h3>
    </section>
  );
};
