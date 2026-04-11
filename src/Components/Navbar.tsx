import { PanelsTopLeft, Moon, Sun, EyeOff } from 'lucide-react';

import { useState } from 'react';

export function Navbar() {
  const [boards, setBoards] = useState<string[]>([
    'Platform Launch',
    'Marketing Plan',
    'Roadmap',
  ]);
  const [boardSelected, setBoardSelected] = useState<number>(0);
  const [isDark, setIsDark] = useState<boolean>(false);

  return (
    <nav className="flex flex-col justify-between bg-card-dark h-full col-span-1 row-span-10 border-r border-secondary-text/20">
      <div>
        <div className="flex flex-row gap-x-4 items-center py-6 px-8">
          <div className="flex flex-row gap-x-1 justify-center">
            <div className="w-1 h-6 bg-action rounded-md"></div>
            <div className="w-1 h-6 bg-action/70 rounded-md"></div>
            <div className="w-1 h-6 bg-action/50 rounded-md"></div>
          </div>
          <span className="text-4xl font-bold">kanban</span>
        </div>
        <div className="pt-4">
          <span className="text-secondary-text font-bold text-xs tracking-[0.2rem] px-8">
            ALL BOARDS ({boards.length})
          </span>
          <div className="flex flex-col py-6 pr-6 gap-y-2">
            {boards.map((board) => (
              <button
                key={board}
                className={`flex flex-row gap-x-4 cursor-pointer transition-colors py-3 rounded-r-full px-6 ${boardSelected === boards.indexOf(board) ? 'bg-action hover:bg-action/80' : 'hover:bg-action/20 text-secondary-text'}`}
                onClick={() => setBoardSelected(boards.indexOf(board))}
              >
                <PanelsTopLeft />
                <span className="font-semibold">{board}</span>
              </button>
            ))}
            <button className="flex flex-row gap-x-4 cursor-pointer transition-colors py-3 rounded-r-full px-6 text-action/80 hover:bg-action/20">
              <PanelsTopLeft />
              <span className="font-semibold">+ Create New Board</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 mx-auto py-6">
        <div className="flex flex-row gap-x-6 items-center justify-center bg-main-dark py-3 px-4 rounded-xl text-secondary-text">
          <Sun />
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-10 h-5 bg-action rounded-full p-1 transition-colors cursor-pointer"
          >
            <div
              className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                isDark ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <Moon />
        </div>
        <button className="flex flex-row gap-x-4 py-2 px-2 text-secondary-text text-sm font-bold cursor-pointer hover:bg-main-dark/30 transition-colors rounded-xl">
          <EyeOff />
          <span>Hide Sidebar</span>
        </button>
      </div>
    </nav>
  );
}
