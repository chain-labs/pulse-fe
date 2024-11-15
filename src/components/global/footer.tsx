export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-1/2 mb-4 w-full max-w-[60vw] -translate-x-1/2 text-center font-sans text-[14px] z-10">
      by using our app you agree to our{" "}
      <a
        href="https://github.com/chain-labs/pulse-fe/blob/main/terms-conditions.md"
        target="_blank"
        className="text-blue-500"
      >
        terms of service
      </a>{" "}
      and{" "}
      <a
        href="https://github.com/chain-labs/pulse-fe/blob/main/privacy-policy.md"
        target="_blank"
        className="text-blue-500"
      >
        privacy policy
      </a>
    </footer>
  );
}
