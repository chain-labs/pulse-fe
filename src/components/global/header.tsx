export default function Header() {
  return (
    <>
      {/* Desktop view */}
      <div className="hidden items-center justify-between sm:flex">
        <div>Logo</div>
        <div>Desktop Menu</div>
      </div>
      {/* Mobile View */}
      <div className="flex items-center justify-between sm:hidden">
        <div>Logo</div>
        <div>Mobile Menu</div>
      </div>
    </>
  );
}
