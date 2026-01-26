export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-4 py-2
        text-sm font-medium
        bg-zinc-900 text-white
        hover:bg-zinc-800
        disabled:opacity-50
        transition
        ${className}
      `}
    />
  );
}

export default Button;
