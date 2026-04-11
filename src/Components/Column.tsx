import { TaskCard } from './TaskCard';

interface Task {
  id: number;
  title: string;
  end_date: string;
}

interface Column {
  name: string;
  tasks: Task[];
}

export function Column({ name, tasks }: Column) {
  return (
    <div className="flex flex-col gap-y-4 h-full min-h-0">
      <div className="flex flex-row items-center gap-x-3 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${name === 'DONE' ? 'bg-lime-500' : name === 'DOING' ? 'bg-purple-600' : 'bg-cyan-500'}`}
        ></div>
        <span className="font-bold tracking-widest text-secondary-text text-xs">
          {name} ({tasks.length})
        </span>
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-auto max-h-full pr-1 custom-scrollbar">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            endDate={task.end_date}
          />
        ))}
      </div>
    </div>
  );
}
