// IMPORT ICONS
import { X } from 'lucide-react';

// IMPORT REACT
import { useRef, useEffect, useState } from 'react';

// IMPORT SUPABASE CLIENT
import { supabase } from '../supabase';

// IMPORT TYPE
import type { ColumnType } from '../types';
type ColumnRequest = Omit<ColumnType, 'id'>;

interface NewColumnProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
  onColumnCreated: (newColumn: ColumnType) => void;
  actualBoard: string;
}

export function NewColumn({
  isVisible,
  onClose,
  userId,
  onColumnCreated,
  actualBoard,
}: NewColumnProps) {
  const containerRef = useRef<HTMLFormElement>(null);

  const [columnName, setColumnName] = useState<string>('');
  const [columnColor, setColumnColor] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handles click outside the menu to close it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        onClose();
        setColumnName('');
        setColumnColor('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const columnToSend: ColumnRequest = {
    user_id: userId,
    name: columnName,
    color: columnColor,
    board: actualBoard,
  };

  async function createColumn(e: React.FormEvent) {
    e.preventDefault();

    if (columnName === '') {
      setErrorMessage(`You can't have an empty name for a column`);
      return;
    }
    const { data, error } = await supabase
      .from('columns')
      .insert(columnToSend)
      .select();

    if (error) {
      console.log(error.message);
    } else {
      setErrorMessage('');
      onClose();
      setColumnName('');
      setColumnColor('');
      onColumnCreated(data[0]);
    }
  }

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
          <form
            ref={containerRef}
            onSubmit={createColumn}
            className="dark:bg-card-dark bg-main-white rounded-lg p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold mb-4 dark:text-primary-text text-card-dark/60">
                Create New Board
              </h2>
              <button
                className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                onClick={() => {
                  onClose();
                  setColumnColor('');
                  setColumnName('');
                }}
              >
                <X />
              </button>
            </div>

            <div className="gap-y-6 flex flex-col w-full">
              <div className="flex items-center w-full h-full gap-x-4">
                <label className="flex flex-col gap-y-2 w-2/3">
                  <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                    Name
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Todo"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-sm"
                  />
                </label>
                <div className="flex flex-col gap-y-2 w-1/4">
                  <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                    Color
                  </span>
                  <input
                    type="color"
                    value={columnColor}
                    onChange={(e) => setColumnColor(e.target.value)}
                    className="h-8 w-8 rounded-lg cursor-pointer outline-none ring-0 styled-color"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-4">
                <p className="text-red-500 text-center">{errorMessage}</p>
                <button
                  type="submit"
                  className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors"
                >
                  <span className="text-sm">Create Board</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
