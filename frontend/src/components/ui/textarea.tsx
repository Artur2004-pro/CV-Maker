export function Textarea(props: any) {
  return (
    <textarea
      {...props}
      className="
        w-full rounded-xl border border-zinc-300
        px-3 py-2 text-sm resize-none
        focus:outline-none focus:ring-2 focus:ring-zinc-900
      "
    />
  );
}
