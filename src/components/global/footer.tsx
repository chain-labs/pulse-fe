export default function Footer() {
  return (
    <footer className=" fixed bottom-0 mb-6 w-full text-center text-[14px]">
      by submitting you agree to our{" "}
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
