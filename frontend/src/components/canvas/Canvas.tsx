import React from "react";
import { useEditor } from "../../editor/EditorContext";
import { BlockRenderer } from "./BlockRenderer";

export const Canvas: React.FC = () => {
  const { blocks } = useEditor();
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};
