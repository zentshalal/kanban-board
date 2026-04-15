// IMPORT COMPONENTS
import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';
import { BoardContent } from './Components/BoardContent';
import { NewTask } from './Components/NewTask';
import { NewBoard } from './Components/NewBoard';
import { NewColumn } from './Components/NewColumn';

// IMPORT SUPABASE
import { supabase } from './supabase';

// IMPORT ICON
import { Eye } from 'lucide-react';

// IMPORT REACT
import { useState, useEffect } from 'react';

// IMPORT TYPE
import type { BoardType, TaskType, ColumnType } from './types';
import type { PostgrestError } from '@supabase/supabase-js';

// Generates a random user_id if there's none in localstorage
function getUserId() {
  const key = 'user_id';

  let userId = localStorage.getItem(key);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(key, userId);
  }

  return userId;
}

// Gets the boards of the user
async function getBoards(userId: string): Promise<BoardType[] | null> {
  const {
    data,
    error,
  }: { data: BoardType[] | null; error: PostgrestError | null } = await supabase
    .from('boards')
    .select()
    .eq('user_id', userId);

  if (error) {
    console.log(error.message);
    return null;
  }

  return data;
}

// Gets the columns of the user
async function getColumns(
  board: string,
  userId: string
): Promise<ColumnType[] | null> {
  const { data, error } = await supabase
    .from('columns')
    .select()
    .eq('user_id', userId)
    .eq('board', board);

  if (!error) {
    return data as ColumnType[] | null;
  }

  if (error.message.includes('column columns.board does not exist')) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('columns')
      .select()
      .eq('user_id', userId)
      .eq('board_id', board);

    if (fallbackError) {
      console.log(fallbackError.message);
      return null;
    }

    return fallbackData as ColumnType[] | null;
  }

  console.log(error.message);
  return null;
}

// Gets the tasks of the user
async function getTasks(
  board: string,
  userId: string
): Promise<TaskType[] | null> {
  const {
    data,
    error,
  }: { data: TaskType[] | null; error: PostgrestError | null } = await supabase
    .from('tasks')
    .select()
    .eq('user_id', userId)
    .eq('board', board);

  if (!error) {
    return data;
  }

  if (error.message.includes('column tasks.board does not exist')) {
    const {
      data: fallbackData,
      error: fallbackError,
    }: { data: TaskType[] | null; error: PostgrestError | null } =
      await supabase
        .from('tasks')
        .select()
        .eq('user_id', userId)
        .eq('board_id', board);

    if (fallbackError) {
      console.log(fallbackError.message);
      return null;
    }

    return fallbackData;
  }

  console.log(error.message);
  return null;
}

// Checks if the user is on mobile
function useWindowSize() {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function App() {
  const isMobile = useWindowSize();

  const userId = getUserId();

  const [boards, setBoards] = useState<BoardType[] | null | undefined>(null);
  const [selectedBoard, setSelectedBoard] = useState<string>('');

  const [columns, setColumns] = useState<ColumnType[] | null | undefined>(null);

  const [tasks, setTasks] = useState<TaskType[] | null | undefined>(null);

  function handleBoardCreated(newBoard: BoardType) {
    setBoards((prev) => [...(prev ?? []), newBoard]);
    setSelectedBoard(newBoard.id);
  }

  function handleTaskCreated(newTask: TaskType) {
    setTasks((prev) => [...(prev ?? []), newTask]);
  }

  function handleTaskDeleted(taskId: string) {
    setTasks((prev) => (prev ?? []).filter((task) => task.id !== taskId));
  }

  function handleTaskEdited(editedTask: TaskType) {
    setTasks((prev) =>
      (prev ?? []).map((task) => (task.id === editedTask.id ? editedTask : task))
    );
  }

  function handleColumnCreated(newColumn: ColumnType) {
    setColumns((prev) => [...(prev ?? []), newColumn]);
  }

  useEffect(() => {
    getBoards(userId).then((data: BoardType[] | null) => {
      setBoards(data);

      if (data && data.length > 0) {
        setSelectedBoard(data[0].id);
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!selectedBoard) {
      return;
    }

    Promise.all([
      getColumns(selectedBoard, userId),
      getTasks(selectedBoard, userId),
    ]).then(([columnsData, tasksData]) => {
      setColumns(columnsData);
      setTasks(tasksData);
      console.log('debug:selectedBoard', selectedBoard);
      console.log('debug:userId', userId);
      console.log('debug:columnsData', columnsData);
      console.log('debug:tasksData', tasksData);
    });
  }, [selectedBoard, userId]);

  const [isNewTaskVisible, setIsNewTaskVisible] = useState<boolean>(false);
  // If the user is on mobile the navbar is naturally hidden
  const [isNavbarHidden, setIsNavbarHidden] = useState<boolean>(
    isMobile ? true : false
  );
  const [isNewBoardVisible, setIsNewBoardVisible] = useState<boolean>(false);

  const [isNewColumnVisible, setIsNewColumnVisible] = useState<boolean>(false);
  const hasBoards = (boards?.length ?? 0) > 0;
  const hasColumns = (columns?.length ?? 0) > 0;

  return (
    <main className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 grid-rows-10 w-screen h-screen">
      <Navbar
        isMobile={isMobile}
        setNavbarHidden={() => setIsNavbarHidden((prev) => !prev)}
        isNavbarHidden={isNavbarHidden}
        boards={boards}
        selectedBoard={selectedBoard}
        onBoardChange={(boardName: string) => setSelectedBoard(boardName)}
        addNewBoard={() => setIsNewBoardVisible((prev) => !prev)}
      />
      {/* Button version not on mobile */}
      {isNavbarHidden && !isMobile && (
        <>
          <button
            onClick={() => setIsNavbarHidden((prev) => !prev)}
            className="fixed outline-none p-3 bg-action rounded-full m-4 bottom-0 cursor-pointer hover:bg-action/80 transition-colors"
          >
            <Eye />
          </button>
        </>
      )}
      {/* Button version on mobile */}
      {isMobile && isNavbarHidden && (
        <>
          <button
            onClick={() => {
              setIsNavbarHidden((prev) => !prev);
            }}
            className="fixed outline-none p-3 bg-action rounded-full m-4 bottom-0 cursor-pointer hover:bg-action/80 transition-colors"
          >
            <Eye />
          </button>
        </>
      )}
      <Banner
        isMobile={isMobile}
        addNewTask={() => {
          if (!hasColumns) return;
          setIsNewTaskVisible((prev) => !prev);
        }}
        isNavbarHidden={isNavbarHidden}
        canCreateTask={hasColumns}
      />
      {hasBoards ? (
        <BoardContent
          isNavbarHidden={isNavbarHidden}
          isMobile={isMobile}
          tasks={tasks}
          columns={columns}
          onTaskDeleted={handleTaskDeleted}
          onTaskEdited={handleTaskEdited}
          addNewColumn={() => setIsNewColumnVisible((prev) => !prev)}
        />
      ) : (
        <section
          className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'col-span-1 -z-1 hidden' : ''} col-span-4 sm:col-span-3 md:col-span-4 row-span-9 w-full h-full flex items-center justify-center dark:bg-main-dark bg-white px-6`}
        >
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold dark:text-primary-text text-card-dark/60 mb-3">
              No board yet
            </h2>
            <p className="dark:text-secondary-text text-card-dark/70 mb-6">
              Create your first board to start organizing your tasks.
            </p>
            <button
              onClick={() => setIsNewBoardVisible(true)}
              className="px-4 py-2 rounded-full bg-action font-semibold cursor-pointer hover:bg-action/80 transition-colors"
            >
              + Create Board
            </button>
          </div>
        </section>
      )}
      <NewTask
        handleTaskCreated={handleTaskCreated}
        actualBoard={selectedBoard}
        isVisible={isNewTaskVisible}
        onClose={() => setIsNewTaskVisible(false)}
        userId={userId}
        columns={columns ?? []}
      />
      <NewBoard
        isVisible={isNewBoardVisible}
        onClose={() => setIsNewBoardVisible(false)}
        userId={userId}
        onBoardCreated={handleBoardCreated}
      />
      <NewColumn
        isVisible={isNewColumnVisible}
        onClose={() => setIsNewColumnVisible(false)}
        userId={userId}
        onColumnCreated={handleColumnCreated}
        actualBoard={selectedBoard}
      />
    </main>
  );
}

export default App;
