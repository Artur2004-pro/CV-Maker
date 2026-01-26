export function Card({ className = "", ...props }: any) {
  return (
    <div
      {...props}
      className={`
        rounded-2xl border border-zinc-200
        bg-white p-6 shadow-sm
        ${className}
      `}
    />
  );
}
