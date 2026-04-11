import { FlagTriangleRight } from 'lucide-react';

export function TaskCard({ id, title, endDate }) {
  return (
    <div
      id={id}
      className="bg-card-dark shadow-xl flex flex-col py-6 px-4 rounded-xl w-full gap-y-2 cursor-pointer hover:bg-card-dark/60 transition-colors"
    >
      <span className="font-semibold text-lg">{title}</span>
      <span className="text-secondary-text text-sm font-semibold flex flex-row items-center gap-x-2">
        <FlagTriangleRight size={16} />
        {endDate}
      </span>
    </div>
  );
}
