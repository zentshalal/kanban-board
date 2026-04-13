import { FlagTriangleRight } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  endDate: string | null;
}

export function TaskCard({ id, title, endDate }: Task) {
  return (
    <div
      id={id}
      className="dark:bg-card-dark bg-main-white dark:shadow-xl dark:shadow- flex flex-col py-6 px-4 rounded-xl w-full gap-y-2 cursor-pointer hover:dark:bg-card-dark/60 hover:bg-main-dark/20 transition-colors"
    >
      <span className="font-semibold text-lg dark:text-primary-text text-card-dark/60">
        {title}
      </span>
      <span className="dark:text-secondary-text text-main-dark/40 text-sm font-semibold flex flex-row items-center gap-x-2">
        <FlagTriangleRight size={16} />
        {endDate}
      </span>
    </div>
  );
}
