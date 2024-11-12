export default function Header() {
  return (
    <>
      {/* Desktop view */}
      <div className="hidden sm:flex justify-between items-center">
        <div>Logo</div>
        <div>Desktop Menu</div>
      </div>
      {/* Mobile View */}
      <div className="sm:hidden flex justify-between items-center">
        <div>Logo</div>
        <div>Mobile Menu</div>
      </div>
    </>
  );
}
