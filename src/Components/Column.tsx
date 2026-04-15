// IMPORT COMPONENTS
import { TaskCard } from './TaskCard';
import { EditTaskMenu } from './EditTaskMenu';

// IMPORT TYPE
import type { ColumnType, TaskType } from '../types';

// IMPORT REACT
import { useState } from 'react';

// IMPORT DRAG AND DROP
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface Column {
  id: string;
  name: string;
  tasks: TaskType[];
  color: string;
  onTaskDeleted: (taskId: string) => void;
  onTaskEdited: (task: TaskType) => void;
  columns: ColumnType[];
}

export function Column({
  id,
  name,
  tasks,
  color,
  onTaskDeleted,
  onTaskEdited,
  columns,
}: Column) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  function handleOpenEditMenu(task: TaskType) {
    setSelectedTask(task);
  }

  return (
    <>
      <div className="flex flex-col h-full min-h-0 shrink-0 w-80">
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
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex flex-col gap-y-4 overflow-y-auto overflow-x-hidden h-full custom-scrollbar-y rounded-lg transition-colors ${snapshot.isDraggingOver ? 'dark:bg-card-dark/30 bg-main-dark/10' : ''}`}
            >
              {tasks && tasks.length > 0 ? (
                tasks.map((task: TaskType, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                      >
                        <TaskCard
                          id={task.id}
                          title={task.title}
                          endDate={task.expires_at}
                          onClick={() => handleOpenEditMenu(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="flex flex-col py-6 px-4 w-full">
                  <span className="font-semibold text-lg dark:text-primary-text/40 text-card-dark/40">
                    No tasks yet
                  </span>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      {selectedTask && (
        <EditTaskMenu
          key={selectedTask.id}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={onTaskDeleted}
          onEdit={onTaskEdited}
          columns={columns}
        />
      )}
    </>
  );
}
