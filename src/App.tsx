import { Banner } from './Components/Banner';
import { Navbar } from './Components/Navbar';

function App() {
  return (
    <main className="grid grid-cols-5 grid-rows-10 w-full h-full">
      <Navbar />
      <Banner />
    </main>
  );
}

export default App;
