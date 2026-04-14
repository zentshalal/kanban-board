// IMPORT ICONS
import { X } from 'lucide-react';

// IMPORT REACT
import { useRef, useEffect, useState } from 'react';

// IMPORT SUPABASE CLIENT
import { supabase } from '../supabase';

// IMPORT BOARD TYPE
import type { BoardType } from '../types';
type BoardRequest = Omit<BoardType, 'id'>;

interface NewBoardProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
  onBoardCreated: (newBoard: BoardType) => void;
}

export function NewBoard({
  isVisible,
  onClose,
  userId,
  onBoardCreated,
}: NewBoardProps) {
  const containerRef = useRef<HTMLFormElement>(null);

  // Handles click outside the menu to close it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const [boardName, setBoardName] = useState<string>('');

  const boardToSend: BoardRequest = {
    user_id: userId,
    name: boardName,
  };

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from('boards')
      .insert(boardToSend)
      .select();

    if (error) {
      console.log(error.message);
    } else {
      console.log(data);
      onClose();
      setBoardName('');
      onBoardCreated(data[0]);
    }
  }

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
          <form
            ref={containerRef}
            onSubmit={createBoard}
            className="dark:bg-card-dark bg-main-white rounded-lg p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold mb-4 dark:text-primary-text text-card-dark/60">
                Create New Board
              </h2>
              <button
                className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                onClick={onClose}
              >
                <X />
              </button>
            </div>

            <div className="gap-y-6 flex flex-col w-full">
              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Name
                </span>
                <input
                  type="text"
                  placeholder="e.g. Project Alpha"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-sm"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors"
              >
                <span className="text-sm">Create Board</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
