export function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />;
}
