export default function Button({
  className,
  children,
  ...buttonProps
}: ButtonProps & JSX.IntrinsicElements["button"]) {
  return (
    <button
      className={`rounded bg-[#5cfda2] px-4 py-2 font-bold text-black hover:bg-[#0b2416] hover:text-white ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
