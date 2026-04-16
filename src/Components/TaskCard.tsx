// IMPORT ICONS
import { FlagTriangleRight } from 'lucide-react';

// IMPORT TYPE
import type { MouseEventHandler } from 'react';

interface Task {
  id: string;
  title: string;
  endDate: string | null;
  onClick: MouseEventHandler;
}

export function TaskCard({ id, title, endDate, onClick }: Task) {
  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    const [year, month, day] = dateString.split('-');
    return `${day} / ${month} / ${year}`;
  }

  function isDateExpired(dateString: string | null) {
    if (!dateString) return false;

    const expirationDate: Date = new Date(dateString);
    const now: Date = new Date();
    now.setHours(0, 0, 0, 0);

    if (expirationDate < now) return true;

    return false;
  }

  return (
    <div
      onClick={onClick}
      id={id}
      className="dark:bg-card-dark bg-main-white dark:shadow-xl dark:shadow- flex flex-col py-6 px-4 rounded-xl w-full gap-y-2 cursor-pointer hover:dark:bg-card-dark/60 hover:bg-main-dark/20 transition-colors"
    >
      <span className="font-semibold text-lg dark:text-primary-text text-card-dark/60">
        {title}
      </span>
      <span
        className={`text-sm flex flex-row items-center gap-x-2 ${isDateExpired(endDate) ? 'text-red-300 font-bold' : 'dark:text-secondary-text text-main-dark/40 font-semibold'}`}
      >
        <FlagTriangleRight size={16} />
        {formatDate(endDate)} {isDateExpired(endDate) ? '- (Expired)' : ''}
      </span>
    </div>
  );
}
