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
  const hasColumns = (columns?.length ?? 0) > 0;

  return (
    <div
      className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'col-span-1 -z-1 hidden' : ''} col-span-4 sm:col-span-3 md:col-span-4 flex flex-row gap-x-6 pt-6 pb-2 px-6 row-span-9 w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar-x dark:bg-main-dark bg-white`}
    >
      {hasColumns ? (
        <>
          {/* TODO COLUMNS */}
          {columns?.map((column) => {
            const columnTasks =
              tasks?.filter((task) => {
                return task.column === column.id;
              }) ?? [];

            return (
              <Column
                key={column.id}
                name={column.name.toUpperCase()}
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
        </>
      ) : (
        <section className="w-full h-full flex items-center justify-center">
          <div className="max-w-lg w-full p-8 text-center">
            <h2 className="text-2xl font-bold dark:text-primary-text text-card-dark/60 mb-3">
              This board has no columns yet
            </h2>
            <p className="dark:text-secondary-text text-card-dark/70 mb-6">
              Create your first column to unlock task creation and start
              planning your workflow.
            </p>
            <button
              onClick={addNewColumn}
              className="px-4 py-2 rounded-full bg-action font-semibold cursor-pointer hover:bg-action/80 transition-colors"
            >
              + Create First Column
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
