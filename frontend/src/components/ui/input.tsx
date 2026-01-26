export function Input(props: any) {
  return (
    <input
      {...props}
      className="
        w-full rounded-xl border border-zinc-300
        px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-zinc-900
      "
    />
  );
}
