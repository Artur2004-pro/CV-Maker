import { useEditorCtx } from "../../editor/EditorContext";

export function Toolbar() {
  const { selectedId, blocks, setBlocks } = useEditorCtx();
  const selectedBlock = blocks.find((b) => b.id === selectedId);

  if (!selectedBlock) {
    return (
      <div
        style={{
          padding: 8,
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        Select a block to edit
      </div>
    );
  }

  const updateBlock = (updates: Partial<typeof selectedBlock>) => {
    setBlocks((b) =>
      b.map((blk) => (blk.id === selectedId ? { ...blk, ...updates } : blk)),
    );
  };

  const copyBlock = () => {
    const newBlock = {
      ...selectedBlock,
      id: crypto.randomUUID(),
      x: selectedBlock.x + 20,
      y: selectedBlock.y + 20,
    };
    setBlocks((b) => [...b, newBlock]);
  };

  const deleteBlock = () => {
    setBlocks((b) => b.filter((blk) => blk.id !== selectedId));
  };

  return (
    <div
      style={{
        padding: 8,
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >HELOOOOOOOO
      {/* Copy/Delete */}
      <button onClick={copyBlock}>Copy</button>
      <button onClick={deleteBlock}>Delete</button>

      {/* Border-radius slider */}
      <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
        Border radius:
        <input
          type="range"
          min={0}
          max={50}
          value={selectedBlock.borderRadius || 4}
          onChange={(e) => updateBlock({ borderRadius: +e.target.value })}
        />
        <span>{selectedBlock.borderRadius}px</span>
      </label>

      {/* Text formatting */}
      <button
        onClick={() =>
          updateBlock({ content: `<b>${selectedBlock.content}</b>` })
        }
      >
        Bold
      </button>
      <button
        onClick={() =>
          updateBlock({ content: `<i>${selectedBlock.content}</i>` })
        }
      >
        Italic
      </button>
      <button
        onClick={() =>
          updateBlock({ content: `<h2>${selectedBlock.content}</h2>` })
        }
      >
        H2
      </button>
      <button
        onClick={() =>
          updateBlock({ content: `<h3>${selectedBlock.content}</h3>` })
        }
      >
        H3
      </button>
    </div>
  );
}
