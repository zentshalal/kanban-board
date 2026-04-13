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
import type { Board } from './types';
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
async function getBoards(): Promise<Board[] | null | undefined> {
  const {
    data,
    error,
  }: { data: Board[] | null; error: PostgrestError | null } = await supabase
    .from('boards')
    .select()
    .eq('user_id', getUserId());

  if (error) {
    console.log(error.message);
  } else {
    return data;
  }
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

  const [boards, setBoards] = useState<Board[] | null | undefined>(null);
  const [selectedBoard, setSelectedBoard] = useState<string>('');

  function handleBoardCreated(newBoard: Board) {
    if (boards) {
      setBoards([...boards, newBoard]);
      setSelectedBoard(newBoard.id);
    } else {
      setBoards([newBoard]);
      setSelectedBoard(newBoard.id);
    }
  }

  useEffect(() => {
    getBoards().then((data: Board[] | null | undefined) => {
      setBoards(data);

      if (data && data.length > 0) {
        setSelectedBoard(data[0].id);
      }
    });
  }, []);

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
        selectedBoard={selectedBoard}
      />
      <NewTask
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
