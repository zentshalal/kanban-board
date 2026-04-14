// IMPORT ICONS
import { ChevronDown, X } from 'lucide-react';

// IMPORT REACT
import { useRef, useEffect, useState } from 'react';

// IMPORT SUPABASE CLIENT
import { supabase } from '../supabase';

// IMPORT TASK TYPE
import type { TaskType, ColumnType } from '../types';

type TaskRequest = Omit<TaskType, 'id' | 'created_at'>;

interface NewTaskProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
  actualBoard: string;
  handleTaskCreated: (newTask: TaskType) => void;
  columns: ColumnType[];
}

export function NewTask({
  isVisible,
  onClose,
  userId,
  actualBoard,
  handleTaskCreated,
  columns,
}: NewTaskProps) {
  const containerRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [column, setColumn] = useState<string>('');

  // Handles click outside the menu to close it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        onClose();
        setTitle('');
        setDescription('');
        setColumn('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const taskToSend: TaskRequest = {
    user_id: userId,
    title: title,
    description: description,
    column: column !== '' ? column : columns[0]?.id,
    position: 0,
    expires_at: null,
    board: actualBoard,
  };

  async function createTask(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToSend)
      .select();

    if (error) {
      console.log(error.message);
    } else {
      console.log(data);
      console.log('Success, task created!');
      onClose();

      setTitle('');
      setDescription('');
      setColumn('');

      handleTaskCreated(data[0]);
    }
  }

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
          <form
            ref={containerRef}
            onSubmit={createTask}
            className="dark:bg-card-dark bg-main-white rounded-lg p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold mb-4 dark:text-primary-text text-card-dark/60">
                Add New Task
              </h2>
              <button
                className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                onClick={() => {
                  onClose();
                  setTitle('');
                  setDescription('');
                  setColumn('');
                }}
              >
                <X />
              </button>
            </div>

            <div className="gap-y-6 flex flex-col w-full">
              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Title
                </span>
                <input
                  type="text"
                  placeholder="e.g. Take a coffee break"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-sm"
                />
              </label>

              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Description
                </span>
                <textarea
                  placeholder="e.g. It's always good to take a break. This 15 minutes break will recharge the batteries a little."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-sm resize-none"
                  rows={5}
                ></textarea>
              </label>

              <label className="flex flex-col gap-y-2 w-full">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Status
                </span>
                <div className="w-full relative">
                  <select
                    onChange={(e) => setColumn(e.target.value as string)}
                    name="column"
                    id="column"
                    className="outline-none border-2 appearance-none dark:border-secondary-text/40 border-action/40 rounded-md p-2 text-sm font-semibold dark:bg-card-dark bg-main-white w-full dark:text-primary-text text-action/40 "
                  >
                    {columns?.map((column) => {
                      return (
                        <option key={column.id} value={column.id}>
                          {column.name.toUpperCase()}
                        </option>
                      );
                    }) ?? <option>No Column</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown
                      size={16}
                      strokeWidth={3}
                      className="dark:text-action text-action/40"
                    />
                  </div>
                </div>
              </label>

              <button
                type="submit"
                className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors"
              >
                <span className="text-sm">Create Task</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
