// IMPORT COMPONENTS
import { TaskCard } from './TaskCard';
import { EditTaskMenu } from './EditTaskMenu';

// IMPORT TYPE
import type { TaskType } from '../types';

// IMPORT REACT
import { useState } from 'react';

interface Column {
  name: string;
  tasks: TaskType[];
  color: string;
  onTaskDeleted: (taskId: string) => void;
}

export function Column({ name, tasks, color, onTaskDeleted }: Column) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  function handleOpenEditMenu(task: TaskType) {
    setSelectedTask(task);
  }

  return (
    <>
      <div className="flex flex-col gap-y-4 h-full min-h-0 shrink-0 w-80">
        <div className="flex flex-row items-center gap-x-3 mb-2">
          <div
            style={{
              backgroundColor: color,
              width: 12,
              height: 12,
              borderRadius: 100,
            }}
          ></div>
          <span className="font-bold tracking-widest dark:text-secondary-text text-card-dark/60 text-xs">
            {name} ({tasks.length})
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
                onClick={() => handleOpenEditMenu(task)}
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
      {selectedTask && (
        <EditTaskMenu
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={onTaskDeleted}
        />
      )}
    </>
  );
}
