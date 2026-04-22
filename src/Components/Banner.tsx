// IMPORT ICONS
import { EllipsisVertical } from 'lucide-react';

// IMPORT REACT
import { useState, useEffect, useRef } from 'react';
import { ManageMenu } from './ManageMenu';

// IMPORT COMPONENTS
import { ColumnMenu } from './ColumnMenu';
import { BoardMenu } from './BoardMenu';
import type { BoardType, ColumnType } from '../types';
import { supabase } from '../supabase';

interface BannerProps {
  addNewTask: () => void;
  isNavbarHidden: boolean;
  isMobile: boolean;
  canCreateTask: boolean;
  columns: ColumnType[] | null | undefined;
  boards: BoardType[] | null | undefined;
  onColumnDeleted: (columndId: string) => void;
  onColumnEdited: (column: ColumnType) => void;
  onColumnsReordered: (columns: ColumnType[]) => Promise<void>;
  onBoardEdited: (board: BoardType) => void;
  onBoardsReordered: (boards: BoardType[]) => Promise<void>;
  onBoardDeleted: (boardId: string) => void;
  selectedBoardId: string;
}

export function Banner({
  addNewTask,
  isNavbarHidden,
  isMobile,
  canCreateTask,
  columns,
  boards,
  onColumnDeleted,
  onColumnEdited,
  onColumnsReordered,
  onBoardEdited,
  onBoardsReordered,
  onBoardDeleted,
  selectedBoardId,
}: BannerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState<boolean>(false);
  const columnMenuRef = useRef<HTMLDivElement | null>(null);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState<boolean>(false);
  const boardMenuRef = useRef<HTMLDivElement | null>(null);

  /**
   * Closes the manage menu when users click outside it so the menu behaves like
   * a proper transient popover.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current?.contains(e.target as Node)) {
        setIsMenuOpen((prev) => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Closes the board management modal trigger when focus leaves its container,
   * preventing stacked overlay states.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        boardMenuRef.current &&
        !boardMenuRef.current?.contains(e.target as Node)
      ) {
        setIsBoardMenuOpen((prev) => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Closes the column management modal trigger on outside click to keep
   * interactions predictable across overlapping menus.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current?.contains(e.target as Node)
      ) {
        setIsColumnMenuOpen((prev) => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedBoardName = boards?.filter(
    (board) => board.id === selectedBoardId
  )[0].name;

  return (
    <header
      className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'row-start-1 z-1' : ''}relative col-span-4 sm:col-span-3 md:col-span-4 flex flex-row items-center justify-between dark:bg-card-dark bg-main-white w-full px-6 py-6 row-span-1 flex-wrap border-b border-secondary-text/20`}
    >
      <div className="text-2xl font-semibold dark:text-primary-text text-action">
        {selectedBoardName}
      </div>
      <div className="flex flex-row gap-x-2 items-center">
        <button
          className={`px-4 py-3 rounded-full font-semibold hover:bg-action/80 bg-action transition-colors ${canCreateTask ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          onClick={() => addNewTask()}
          disabled={!canCreateTask}
        >
          + Add New Task
        </button>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:dark:bg-main-dark/30 hover:bg-main-dark/10 transition-colors cursor-pointer dark:text-primary-text text-card-dark/60"
        >
          <EllipsisVertical />
        </button>
      </div>
      {isMenuOpen && (
        <>
          <ManageMenu
            ref={menuRef}
            openColumnMenu={() => {
              setIsColumnMenuOpen((prev) => !prev);
              setIsMenuOpen((prev) => !prev);
            }}
            openBoardMenu={() => {
              setIsBoardMenuOpen((prev) => !prev);
              setIsMenuOpen((prev) => !prev);
            }}
            onLogout={() => {
              void supabase.auth.signOut();
              setIsMenuOpen(false);
            }}
          />
        </>
      )}
      {isColumnMenuOpen && (
        <ColumnMenu
          onDelete={onColumnDeleted}
          onEdit={onColumnEdited}
          onReorder={onColumnsReordered}
          ref={columnMenuRef}
          onClose={() => setIsColumnMenuOpen((prev) => !prev)}
          columns={columns}
        />
      )}
      {isBoardMenuOpen && (
        <BoardMenu
          onEdit={onBoardEdited}
          onReorder={onBoardsReordered}
          onDelete={onBoardDeleted}
          ref={boardMenuRef}
          onClose={() => setIsBoardMenuOpen((prev) => !prev)}
          boards={boards}
        />
      )}
    </header>
  );
}
