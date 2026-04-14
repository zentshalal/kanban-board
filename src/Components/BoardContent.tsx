// IMPORT COMPONENTS
import { Column } from './Column';

// IMPORT TYPE
import type { TaskType, ColumnType } from '../types';

interface BoardContentProps {
  isNavbarHidden: boolean;
  isMobile: boolean;
  tasks: TaskType[] | null | undefined;
  columns: ColumnType[] | null | undefined;
  addNewColumn: () => void;
}

export function BoardContent({
  isNavbarHidden,
  isMobile,
  tasks,
  columns,
  addNewColumn,
}: BoardContentProps) {
  return (
    <div
      className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'col-span-1 -z-1 hidden' : ''} col-span-4 sm:col-span-3 md:col-span-4 flex flex-row gap-x-6 pt-6 pb-2 px-6 row-span-9 w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar-x dark:bg-main-dark bg-white`}
    >
      {/* TODO COLUMNS */}
      {columns?.map((column) => {
        const columnTasks =
          tasks?.filter((task) => {
            return task.column === column.id;
          }) ?? [];

        return (
          <Column
            key={column.id}
            name={column.name}
            tasks={columnTasks}
            color={column?.color}
          />
        );
      })}
      {/* NEW COLUMN */}
      <button
        onClick={addNewColumn}
        className="dark:bg-card-dark/30 bg-main-white/20 rounded-xl font-bold cursor-pointer hover:dark:bg-card-dark/60 hover:bg-main-dark/20 transition-colors w-80 shrink-0 h-full"
      >
        <p className="text-2xl dark:text-primary-text text-card-dark/60">
          + New Column
        </p>
      </button>
    </div>
  );
}
