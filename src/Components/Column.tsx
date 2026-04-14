// IMPORT COMPONENTS
import { TaskCard } from './TaskCard';

// IMPORT TYPE
import type { TaskType } from '../types';

interface Column {
  name: string;
  tasks?: TaskType[] | [];
}

export function Column({ name, tasks }: Column) {
  return (
    <div className="flex flex-col gap-y-4 h-full min-h-0 shrink-0 w-80">
      <div className="flex flex-row items-center gap-x-3 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${name === 'DONE' ? 'bg-lime-500' : name === 'DOING' ? 'bg-purple-600' : 'bg-cyan-500'}`}
        ></div>
        <span className="font-bold tracking-widest dark:text-secondary-text text-card-dark/60 text-xs">
          {name} ({tasks ? tasks?.length : 0})
        </span>
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-auto max-h-full pr-1 custom-scrollbar-y">
        {tasks && tasks.length > 0 ? (
          tasks.map((task: TaskType) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              endDate={task.expires_at}
            />
          ))
        ) : (
          <div className="dark:shadow- flex flex-col py-6 px-4 w-full">
            <span className="font-semibold text-lg dark:text-primary-text/40 text-card-dark/40">
              No tasks yet
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
