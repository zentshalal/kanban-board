import { EllipsisVertical } from 'lucide-react';

interface BannerProps {
  addNewTask: () => void;
  isNavbarHidden: boolean;
  isMobile: boolean;
  canCreateTask: boolean;
}

export function Banner({
  addNewTask,
  isNavbarHidden,
  isMobile,
  canCreateTask,
}: BannerProps) {
  return (
    <header
      className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'row-start-1 z-1' : ''} col-span-4 sm:col-span-3 md:col-span-4 flex flex-row items-center justify-between dark:bg-card-dark bg-main-white w-full px-6 py-6 row-span-1 flex-wrap border-b border-secondary-text/20`}
    >
      <div className="text-2xl font-semibold dark:text-primary-text text-action">
        Platform Launch
      </div>
      <div className="flex flex-row gap-x-2 items-center">
        <button
          className={`px-4 py-3 rounded-full font-semibold hover:bg-action/80 bg-action transition-colors ${canCreateTask ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          onClick={() => addNewTask()}
          disabled={!canCreateTask}
        >
          + Add New Task
        </button>
        <button className="p-2 rounded-full hover:dark:bg-main-dark/30 hover:bg-main-dark/10 transition-colors cursor-pointer dark:text-primary-text text-card-dark/60">
          <EllipsisVertical />
        </button>
      </div>
    </header>
  );
}
