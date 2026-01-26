import { useEditor } from "../../editor/EditorContext";
import { type Block } from "../../editor/types";

export function Sidebar() {
  const { blocks, setBlocks, selectedId } = useEditor();
  const selectedBlock = blocks.find((b) => b.id === selectedId);

  const addTextBlock = () => {
    const block: Block = {
      id: crypto.randomUUID(),
      type: "text",
      content: "",
      x: 40,
      y: 40,
      width: 400,
      height: 120,
      fontSize: 16,
      lineHeight: 1.4,
      textColor: "#000000",
      backgroundColor: "#ffffff",
      borderRadius: 4,
    };
    setBlocks((b) => [...b, block]);
  };

  const updateBlock = (updates: Partial<Block>) => {
    if (!selectedId) return;
    setBlocks((b) =>
      b.map((blk) => (blk.id === selectedId ? { ...blk, ...updates } : blk)),
    );
  };

  const copyBlock = () => {
    if (!selectedBlock) return;
    const newBlock = {
      ...selectedBlock,
      id: crypto.randomUUID(),
      x: selectedBlock.x + 20,
      y: selectedBlock.y + 20,
    };
    setBlocks((b) => [...b, newBlock]);
  };

  const deleteBlock = () => {
    if (!selectedBlock) return;
    setBlocks((b) => b.filter((blk) => blk.id !== selectedId));
  };

  return (
    <aside
      style={{ width: 280, padding: 16, borderRight: "1px solid #e5e7eb" }}
    >
      <button onClick={addTextBlock}>+ Add Text</button>

      {selectedBlock && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Copy/Delete buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={copyBlock}>Copy</button>
            <button onClick={deleteBlock}>Delete</button>
          </div>

          {/* Border radius */}
          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Border radius:
            <input
              type="range"
              min={0}
              max={50}
              value={selectedBlock.borderRadius}
              onChange={(e) => updateBlock({ borderRadius: +e.target.value })}
            />
            <span>{selectedBlock.borderRadius}px</span>
          </label>

          {/* Font size */}
          <label>
            Font size:
            <input
              type="number"
              value={selectedBlock.fontSize}
              onChange={(e) => updateBlock({ fontSize: +e.target.value })}
            />
          </label>

          {/* Line height */}
          <label>
            Line height:
            <input
              type="number"
              step={0.1}
              value={selectedBlock.lineHeight}
              onChange={(e) => updateBlock({ lineHeight: +e.target.value })}
            />
          </label>

          {/* Text color */}
          <label>
            Text color:
            <input
              type="color"
              value={selectedBlock.textColor}
              onChange={(e) => updateBlock({ textColor: e.target.value })}
            />
          </label>

          {/* Background color */}
          <label>
            Background:
            <input
              type="color"
              value={selectedBlock.backgroundColor}
              onChange={(e) => updateBlock({ backgroundColor: e.target.value })}
            />
          </label>
        </div>
      )}
    </aside>
  );
}
