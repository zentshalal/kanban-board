// IMPORT TYPE
import type { TaskType } from '../types';

// IMPORT REACT
import { useRef, useEffect } from 'react';

// IMPORT ICONS
import { X, FlagTriangleRight, Pencil, Trash } from 'lucide-react';

// IMPORT SUPABASE
import { supabase } from '../supabase';

interface MenuProps {
  task: TaskType;
  onClose: () => void;
  onDelete: (taskId: string) => void;
}

export function EditTaskMenu({ task, onClose, onDelete }: MenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
        <div className="flex flex-row items-start justify-between">
          <h2 className="text-lg font-bold mb-6 dark:text-primary-text text-card-dark/60">
            {task.title}
          </h2>
          <div className="flex flex-row gap-x-2 items-center">
            <button
              onClick={() => deleteTask(task)}
              className="flex flex-row items-center gap-x-1 bg-red-500 hover:bg-red-500/60 transition-colors p-2 rounded-lg cursor-pointer"
            >
              <Trash size={16} />
            </button>
            <button className="flex flex-row items-center gap-x-1 bg-action hover:bg-action/80 transition-colors p-2 rounded-lg cursor-pointer">
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
          <p className="dark:text-primary-text text-card-dark/60">
            {task.description === ''
              ? '"No description available"'
              : task.description}
          </p>
          <div className="flex flex-row gap-x-2 items-center dark:text-secondary-text text-card-dark/40">
            <FlagTriangleRight size={16} />
            <p className="font-semibold">{task.expires_at ?? 'Never'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
