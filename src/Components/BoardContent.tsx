// IMPORT COMPONENTS
import { Column } from './Column';

// IMPORT SUPABASE
import { supabase } from '../supabase';

// IMPORT REACT
import { useState, useEffect } from 'react';

// IMPORT TYPE
import type { Task } from '../types';

interface BoardContentProps {
  isNavbarHidden: boolean;
  isMobile: boolean;
  selectedBoard: string;
}

async function getTasks(selectedBoard: string, selectedColumn: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select()
    .eq('board', selectedBoard)
    .eq('column', selectedColumn);

  if (error) {
    console.log(error.message);
    return [];
  } else {
    return data || [];
  }
}

export function BoardContent({
  isNavbarHidden,
  isMobile,
  selectedBoard,
}: BoardContentProps) {
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doingTasks, setDoingTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!selectedBoard) return;

    async function fetchAllTasks() {
      const [todo, doing, done] = await Promise.all([
        getTasks(selectedBoard, 'todo'),
        getTasks(selectedBoard, 'doing'),
        getTasks(selectedBoard, 'done'),
      ]);

      setTodoTasks(todo);
      setDoingTasks(doing);
      setDoneTasks(done);
    }

    fetchAllTasks();
  }, [selectedBoard]);

  return (
    <div
      className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'col-span-1 -z-1 hidden' : ''} col-span-4 sm:col-span-3 md:col-span-4 flex flex-row gap-x-6 pt-6 pb-2 px-6 row-span-9 w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar-x dark:bg-main-dark bg-white`}
    >
      {/* TODO COLUMN */}
      <Column name="TODO" tasks={todoTasks} />
      {/* DOING COLUMN */}
      <Column name="DOING" tasks={doingTasks} />
      {/* DONE COLUMN */}
      <Column name="DONE" tasks={doneTasks} />
      {/* NEW COLUMN */}
      <button className="dark:bg-card-dark/30 bg-main-white/20 rounded-xl font-bold cursor-pointer hover:dark:bg-card-dark/60 hover:bg-main-dark/20 transition-colors w-80 shrink-0 h-full">
        <p className="text-2xl dark:text-primary-text text-card-dark/60">
          + New Column
        </p>
      </button>
    </div>
  );
}
