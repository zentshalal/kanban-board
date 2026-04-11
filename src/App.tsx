import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';
import { BoardContent } from './Components/BoardContent';
import { NewTask } from './Components/NewTask';

function App() {
  return (
    <main className="grid grid-cols-5 grid-rows-10 w-screen h-screen">
      <Navbar />
      <Banner />
      <BoardContent />
      <NewTask />
    </main>
  );
}

export default App;
