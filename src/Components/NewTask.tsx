// IMPORT ICONS
import { Calendar, ChevronDown, X } from 'lucide-react';

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
  const [dueDate, setDueDate] = useState<string>('');
  const [isNever, setIsNever] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string>('');

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
        setDueDate('');
        setIsNever(true);
        setErrorMessage('');
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
    expires_at: isNever || dueDate === '' ? null : dueDate,
    board: actualBoard,
  };

  async function createTask(e: React.FormEvent) {
    e.preventDefault();

    if (title === '') {
      setErrorMessage(`Your task can't have an empty name`);
      return;
    }

    if (!isNever && dueDate === '') {
      setErrorMessage(`You have to choose a date or check the box 'never'`);
      return;
    }

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
      setDueDate('');
      setIsNever(true);

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
                  setDueDate('');
                  setIsNever(true);
                  setErrorMessage('');
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
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 text-sm text-card-dark/60 dark:text-primary-text font-semibold"
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
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 text-sm resize-none text-card-dark/60 dark:text-primary-text font-semibold"
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
                    className="outline-none border-2 appearance-none dark:border-secondary-text/40 border-action/40 rounded-md p-2 text-sm font-semibold dark:bg-card-dark bg-main-white w-full dark:text-primary-text text-card-dark/60"
                  >
                    {columns?.map((column) => {
                      return (
                        <option
                          key={column.id}
                          value={column.id}
                          className="font-semibold"
                        >
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

              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Due Date
                </span>
                <div className="flex flex-row gap-x-2 items-center">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none dark:text-primary-text text-card-dark/60">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDueDate(value);
                        if (value !== '') {
                          setIsNever(false);
                        }
                      }}
                      disabled={isNever}
                      className={`outline-none border-2 rounded-lg px-2 py-2 dark:text-primary-text text-card-dark/60 font-semibold ${isNever ? 'dark:border-secondary-text/20 border-action/20 opacity-50 cursor-not-allowed' : 'dark:border-secondary-text/40 border-action/40'}`}
                    />
                  </div>
                  <label className="group flex items-center gap-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isNever}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsNever(checked);
                        if (checked) {
                          setDueDate('');
                        }
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isNever ? 'bg-action' : 'bg-slate-400/50 dark:bg-slate-600'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isNever ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </span>
                    <span className="dark:text-primary-text text-card-dark/60 font-semibold text-sm">
                      Never
                    </span>
                  </label>
                </div>
              </label>

              <div className="flex flex-col gap-y-4">
                {errorMessage && (
                  <p className="text-red-500 font-semibold text-center">
                    {errorMessage}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-action py-2 rounded-full font-semibold hover:bg-action/80 transition-colors cursor-pointer"
                >
                  <span className="text-sm">Create Task</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
