import { EllipsisVertical } from 'lucide-react';

export function Banner() {
  return (
    <header className="flex flex-row items-center justify-center sm:justify-between bg-card-dark w-full px-6 py-6 col-span-3 md:col-span-4 row-span-2 sm:row-span-1 flex-wrap border-b border-secondary-text/20">
      <div className="text-2xl font-semibold">Platform Launch</div>
      <div className="flex flex-row gap-x-2 items-center">
        <button className="px-4 py-3 bg-action rounded-full font-semibold hover:bg-action/80 transition-colors cursor-pointer">
          + Add New Task
        </button>
        <button className="p-2 rounded-full hover:bg-main-dark transition-colors cursor-pointer">
          <EllipsisVertical />
        </button>
      </div>
    </header>
  );
}
