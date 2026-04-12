import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';
import { BoardContent } from './Components/BoardContent';
import { NewTask } from './Components/NewTask';

import { useState } from 'react';

function App() {
  const [isNewTaskVisible, setIsNewTaskVisible] = useState<boolean>(false);

  return (
    <main className="grid grid-cols-5 grid-rows-10 w-screen h-screen">
      <Navbar />
      <Banner addNewTask={() => setIsNewTaskVisible((prev) => !prev)} />
      <BoardContent />
      <NewTask
        isVisible={isNewTaskVisible}
        onClose={() => setIsNewTaskVisible(false)}
      />
    </main>
  );
}

export default App;
