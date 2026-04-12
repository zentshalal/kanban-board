import { PanelsTopLeft, Moon, Sun, EyeOff } from 'lucide-react';

import { useState, useEffect } from 'react';

interface NavbarProps {
  setNavbarHidden: () => void;
}

export function Navbar({ setNavbarHidden }: NavbarProps) {
  const boards = ['Platform Launch', 'Marketing Plan', 'Roadmap'];
  const [boardSelected, setBoardSelected] = useState<number>(0);

  // Defines the user's theme reading localStorage or accessing his theme preferences
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme');

    if ((savedTheme && savedTheme === 'dark') || savedTheme === 'light') {
      return savedTheme;
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Toggles the theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.setAttribute('data-theme', '');
      localStorage.theme = 'light';
    }
  }, [theme]);

  console.log();

  return (
    <nav className="sm:flex flex-col justify-between dark:bg-card-dark bg-main-white h-full row-span-10 border-r border-secondary-text/20 hidden sm:col-span-2 md:col-span-1">
      <div>
        <div className="flex flex-row gap-x-4 items-center py-6 px-8">
          <div className="flex flex-row gap-x-1 justify-center">
            <div className="w-1 h-6 bg-action rounded-md"></div>
            <div className="w-1 h-6 bg-action/70 rounded-md"></div>
            <div className="w-1 h-6 bg-action/50 rounded-md"></div>
          </div>
          <span className="text-4xl font-bold dark:text-primary-text text-action">
            kanban
          </span>
        </div>
        <div className="pt-4">
          <span className="dark:text-secondary-text text-card-dark/60 font-bold text-xs tracking-[0.2rem] pl-8">
            ALL BOARDS ({boards.length})
          </span>
          <div className="flex flex-col py-6 pr-6 gap-y-2">
            {boards.map((board) => (
              <button
                key={board}
                className={`flex flex-row gap-x-4 cursor-pointer transition-colors py-3 rounded-r-full px-6 ${boardSelected === boards.indexOf(board) ? 'bg-action hover:bg-action/80 text-primary-text' : 'hover:bg-action/20 dark:text-secondary-text text-card-dark/60'}`}
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
        <div className="flex flex-row gap-x-6 items-center justify-center dark:bg-main-dark bg-action py-3 px-4 rounded-xl text-primary-text dark:text-secondary-text">
          <Sun />
          <button
            onClick={() =>
              setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
            }
            className="relative w-10 h-5 dark:bg-action bg-card-dark/40 rounded-full p-1 transition-colors cursor-pointer"
          >
            <div
              className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <Moon />
        </div>
        <button
          onClick={setNavbarHidden}
          className="flex flex-row gap-x-4 py-2 px-2 dark:text-secondary-text text-card-dark/60 text-sm font-bold cursor-pointer hover:dark:bg-main-dark/30 hover:bg-main-dark/10 transition-colors rounded-xl"
        >
          <EyeOff />
          <span>Hide Sidebar</span>
        </button>
      </div>
    </nav>
  );
}
