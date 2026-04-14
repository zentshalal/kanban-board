// IMPORT COMPONENTS
import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';
import { BoardContent } from './Components/BoardContent';
import { NewTask } from './Components/NewTask';
import { NewBoard } from './Components/NewBoard';

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

  // Supports schemas using board_id instead of board.
  if (error.message.includes("column columns.board does not exist")) {
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
async function getTasks(board: string, userId: string): Promise<TaskType[] | null> {
  const { data, error }: { data: TaskType[] | null; error: PostgrestError | null } = await supabase
    .from('tasks')
    .select()
    .eq('user_id', userId)
    .eq('board', board);

  if (!error) {
    return data;
  }

  // Supports schemas using board_id instead of board.
  if (error.message.includes("column tasks.board does not exist")) {
    const {
      data: fallbackData,
      error: fallbackError,
    }: { data: TaskType[] | null; error: PostgrestError | null } = await supabase
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
    if (boards) {
      setBoards([...boards, newBoard]);
      setSelectedBoard(newBoard.id);
    } else {
      setBoards([newBoard]);
      setSelectedBoard(newBoard.id);
    }
  }

  function handleTaskCreated(newTask: TaskType) {
    setTasks((prev) => [...(prev ?? []), newTask]);
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
    ]).then(
      ([columnsData, tasksData]) => {
        setColumns(columnsData);
        setTasks(tasksData);
        console.log('debug:selectedBoard', selectedBoard);
        console.log('debug:userId', userId);
        console.log('debug:columnsData', columnsData);
        console.log('debug:tasksData', tasksData);
      }
    );
  }, [selectedBoard, userId]);

  const [isNewTaskVisible, setIsNewTaskVisible] = useState<boolean>(false);
  // If the user is on mobile the navbar is naturally hidden
  const [isNavbarHidden, setIsNavbarHidden] = useState<boolean>(
    isMobile ? true : false
  );
  const [isNewBoardVisible, setIsNewBoardVisible] = useState<boolean>(false);

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
        addNewTask={() => setIsNewTaskVisible((prev) => !prev)}
        isNavbarHidden={isNavbarHidden}
      />
      <BoardContent
        isNavbarHidden={isNavbarHidden}
        isMobile={isMobile}
        tasks={tasks}
        columns={columns}
      />
      <NewTask
        handleTaskCreated={handleTaskCreated}
        actualBoard={selectedBoard}
        isVisible={isNewTaskVisible}
        onClose={() => setIsNewTaskVisible(false)}
        userId={userId}
      />
      <NewBoard
        isVisible={isNewBoardVisible}
        onClose={() => setIsNewBoardVisible(false)}
        userId={userId}
        onBoardCreated={handleBoardCreated}
      />
    </main>
  );
}

export default App;
