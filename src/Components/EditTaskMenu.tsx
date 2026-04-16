// IMPORT TYPE
import type { TaskType, ColumnType } from '../types';

// IMPORT REACT
import { useRef, useEffect, useState } from 'react';

// IMPORT ICONS
import {
  X,
  FlagTriangleRight,
  Pencil,
  Trash,
  Calendar,
  ChevronDown,
} from 'lucide-react';

// IMPORT SUPABASE
import { supabase } from '../supabase';

interface MenuProps {
  task: TaskType;
  onClose: () => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: TaskType) => void;
  columns: ColumnType[];
}

export function EditTaskMenu({
  task,
  onClose,
  onDelete,
  onEdit,
  columns,
}: MenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [seeing, setSeeing] = useState<boolean>(true);

  const [newTitle, setNewTitle] = useState<string>(task.title);
  const [newDesc, setNewDesc] = useState<string>(task.description ?? '');
  const [newDate, setNewDate] = useState<string | null>(task.expires_at);
  const [isNever, setIsNever] = useState<boolean>(task.expires_at === null);
  const [newStatus, setNewStatus] = useState<string>(task.column);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  async function deleteTask(task: TaskType) {
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.length > 0) {
      onDelete(task.id);
      onClose();
    } else {
      console.log('Aucune tâche trouvée avec cette ID');
    }
  }

  async function editTask(task: TaskType, e: React.FormEvent) {
    e.preventDefault();

    if (newTitle === '') {
      setErrorMessage(`Your task's name can't be empty`);
      return;
    }

    if (!isNever && newDate === '') {
      setErrorMessage(`You have to choose a date or check the box 'never'`);
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: newTitle,
        description: newDesc,
        expires_at: isNever ? null : newDate,
        column: newStatus,
      })
      .eq('id', task.id)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.length > 0) {
      onEdit(data[0] as TaskType);
      onClose();
    } else {
      console.log('Aucune tâche trouvée avec cette ID');
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
      <div
        ref={containerRef}
        className="dark:bg-card-dark bg-main-white rounded-lg p-8 w-full max-w-md shadow-2xl"
      >
        {seeing && (
          <>
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold mb-6 dark:text-primary-text text-card-dark/60">
                {task.title}
              </h2>
              <div className="flex flex-row gap-x-2 items-center">
                <button
                  onClick={() => {
                    setConfirm((prev) => !prev);
                    setSeeing((prev) => !prev);
                  }}
                  className="flex flex-row items-center gap-x-1 bg-red-500 hover:bg-red-500/60 transition-colors p-2 rounded-lg cursor-pointer"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsUpdating((prev) => !prev);
                    setSeeing((prev) => !prev);
                  }}
                  className="flex flex-row items-center gap-x-1 bg-action hover:bg-action/80 transition-colors p-2 rounded-lg cursor-pointer"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <X />
                </button>
              </div>
            </div>
            <div className="gap-y-6 flex flex-col w-full">
              <p className="dark:text-primary-text text-card-dark/60 font-semibold">
                {task.description === ''
                  ? '"No description available"'
                  : task.description}
              </p>
              <div
                className={`flex flex-row gap-x-2 items-center ${isDateExpired(task.expires_at) ? 'text-red-300' : 'dark:text-secondary-text text-main-dark/40'}`}
              >
                <FlagTriangleRight size={16} />
                <p className="font-semibold">
                  {formatDate(task.expires_at)}{' '}
                  {isDateExpired(task.expires_at) ? '- (Expired)' : ''}
                </p>
              </div>
            </div>
          </>
        )}
        {isUpdating && (
          <>
            <form onSubmit={(e) => editTask(task, e)}>
              <div className="flex flex-row items-start justify-between">
                <input
                  className="mb-6 outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-1 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-lg font-bold dark:text-primary-text text-card-dark/60"
                  placeholder="e.g. Take a coffee break"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <div className="flex flex-row gap-x-2 items-center">
                  <button
                    className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <X />
                  </button>
                </div>
              </div>
              <div className="gap-y-4 flex flex-col w-full">
                <textarea
                  className="resize-none outline-none border-2 font-semibold dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-1 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 dark:text-primary-text text-card-dark/60"
                  placeholder="e.g. It's always good to take a break. This 15 minutes break will recharge the batteries a little."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={5}
                ></textarea>
                <div className="flex flex-row gap-x-2 items-center dark:text-secondary-text text-card-dark/40">
                  <FlagTriangleRight size={16} />
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="date"
                      value={newDate ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewDate(value === '' ? null : value);
                        if (value !== '') {
                          setIsNever(false);
                        }
                      }}
                      disabled={isNever}
                      className={`outline-none border-2 font-semibold rounded-lg px-2 py-1 dark:text-primary-text text-card-dark/60 ${isNever ? 'dark:border-secondary-text/20 border-action/20 opacity-50 cursor-not-allowed' : 'dark:border-secondary-text/40 border-action/40'}`}
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
                          setNewDate(null);
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
                <label className="flex flex-col gap-y-2 w-full">
                  <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                    Change Status
                  </span>
                  <div className="w-full relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as string)}
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
                {errorMessage && (
                  <p className="text-red-500 font-semibold text-md text-center mt-2">
                    {errorMessage}
                  </p>
                )}
                <div className="flex flex-row gap-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdating((prev) => !prev);
                      setSeeing((prev) => !prev);
                    }}
                    className="w-full border border-action/40 py-2 rounded-full cursor-pointer font-semibold hover:bg-action/10 transition-colors dark:text-primary-text text-card-dark/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
        {confirm && (
          <div className="flex flex-col items-start justify-between">
            <h2 className="text-lg font-bold mb-6 dark:text-primary-text text-card-dark/60">
              Are you sure ?
            </h2>
            <div className="flex flex-row w-full gap-x-4 justify-between">
              <button
                onClick={() => onClose()}
                className="bg-green-400 w-full cursor-pointer hover:bg-green-300 transition-colors rounded-full font-bold"
              >
                No
              </button>
              <button
                onClick={() => deleteTask(task)}
                className="bg-red-400 py-2 w-full cursor-pointer hover:bg-red-300 transition-colors rounded-full font-bold"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
