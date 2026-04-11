export function Navbar() {
  return (
    <nav className="flex flex-col bg-card-dark h-full col-span-1 row-span-10 px-8">
      <div className="flex flex-row gap-x-4 items-center py-6">
        <div className="flex flex-row gap-x-1 justify-center">
          <div className="w-1 h-6 bg-action rounded-md"></div>
          <div className="w-1 h-6 bg-action/70 rounded-md"></div>
          <div className="w-1 h-6 bg-action/50 rounded-md"></div>
        </div>
        <span className="text-4xl font-bold">kanban</span>
      </div>
      <div className="py-6">
        <span className="text-secondary-text font-semibold text-sm tracking-widest">
          ALL BOARDS (1)
        </span>
      </div>
    </nav>
  );
}
