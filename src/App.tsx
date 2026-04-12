import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';
import { BoardContent } from './Components/BoardContent';
import { NewTask } from './Components/NewTask';

import { Eye } from 'lucide-react';

import { useState, useEffect } from 'react';

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

  const [isNewTaskVisible, setIsNewTaskVisible] = useState<boolean>(false);
  // If the user is on mobile the navbar is naturally hidden
  const [isNavbarHidden, setIsNavbarHidden] = useState<boolean>(
    isMobile ? true : false
  );

  return (
    <main className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 grid-rows-10 w-screen h-screen">
      <Navbar
        isMobile={isMobile}
        setNavbarHidden={() => setIsNavbarHidden((prev) => !prev)}
        isNavbarHidden={isNavbarHidden}
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
      <BoardContent isNavbarHidden={isNavbarHidden} isMobile={isMobile} />
      <NewTask
        isVisible={isNewTaskVisible}
        onClose={() => setIsNewTaskVisible(false)}
      />
    </main>
  );
}

export default App;
