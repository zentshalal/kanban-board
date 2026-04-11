import { EllipsisVertical } from 'lucide-react';

export function Banner() {
  return (
    <header className="flex flex-row items-center justify-between bg-card-dark w-full px-6 py-6 col-span-4 row-span-1">
      <div className="text-2xl font-semibold">Default Board</div>
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
