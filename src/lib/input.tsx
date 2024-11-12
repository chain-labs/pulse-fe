interface InputProps {
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
}

export default function Input({
  className,
  error,
  ...inputProps
}: InputProps & JSX.IntrinsicElements["input"]) {
  return (
    <>
      <input
        className={`rounded border border-gray-400 px-4 py-2 text-black ${className}`}
        {...inputProps}
      />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
