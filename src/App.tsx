import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';
import { BoardContent } from './Components/BoardContent';
import { NewTask } from './Components/NewTask';

import { Eye } from 'lucide-react';

import { useState } from 'react';

function App() {
  const [isNewTaskVisible, setIsNewTaskVisible] = useState<boolean>(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState<boolean>(false);

  // Sets className for col-span property when navbar is hidden
  const [bannerClass, setBannerClass] = useState<string>('');
  const [boardContentClass, setBoardContentClass] = useState<string>('');

  // Handles the visibility of the navbar
  function handleNavbar() {
    if (!isNavbarHidden) {
      setIsNavbarHidden((prev) => !prev);
      setBannerClass('col-span-4 sm:col-span-5');
      setBoardContentClass('col-span-4 sm:col-span-5');
    } else {
      setIsNavbarHidden((prev) => !prev);
      setBannerClass('');
      setBoardContentClass('');
    }
  }

  return (
    <main className="grid grid-cols-4 sm:grid-cols-5 grid-rows-10 w-screen h-screen">
      {!isNavbarHidden && <Navbar setNavbarHidden={() => handleNavbar()} />}
      {isNavbarHidden && (
        <>
          <button
            onClick={handleNavbar}
            className="fixed outline-none p-3 bg-action rounded-full m-4 bottom-0 cursor-pointer hover:bg-action/80 transition-colors"
          >
            <Eye />
          </button>
        </>
      )}
      <Banner
        addNewTask={() => setIsNewTaskVisible((prev) => !prev)}
        className={bannerClass}
      />
      <BoardContent className={boardContentClass} />
      <NewTask
        isVisible={isNewTaskVisible}
        onClose={() => setIsNewTaskVisible(false)}
      />
    </main>
  );
}

export default App;
