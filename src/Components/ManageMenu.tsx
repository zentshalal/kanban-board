interface MenuProps {
  ref: React.RefObject<HTMLDivElement | null>;
  openColumnMenu: () => void;
  openBoardMenu: () => void;
  onLogout: () => void;
}

export function ManageMenu({
  ref,
  openColumnMenu,
  openBoardMenu,
  onLogout,
}: MenuProps) {
  /**
   * Pure action menu for board-level management shortcuts. Behavior is delegated
   * to parent handlers to keep this component presentation-focused.
   */
  return (
    <>
      <div
        ref={ref}
        className="absolute flex flex-col items-start gap-y-2 lg:top-20 top-22 right-6 rounded-lg bg-main-white dark:bg-card-dark shadow-xl px-4 py-2 w-50"
      >
        <button
          onClick={openColumnMenu}
          className="text-primary-text p-1 bg-action hover:bg-action/60 cursor-pointer transition-colors w-full rounded-lg font-semibold"
        >
          Manage Columns
        </button>
        <button
          onClick={openBoardMenu}
          className="text-primary-text p-1 bg-action hover:bg-action/60 cursor-pointer transition-colors w-full rounded-lg font-semibold"
        >
          Manage Boards
        </button>
        <button
          onClick={onLogout}
          className="text-primary-text p-1 bg-red-400 hover:bg-red-400/60 cursor-pointer transition-colors w-full rounded-lg font-semibold"
        >
          Log Out
        </button>
      </div>
    </>
  );
}
