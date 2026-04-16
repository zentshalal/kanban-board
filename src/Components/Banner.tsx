// IMPORT ICONS
import { EllipsisVertical } from 'lucide-react';

// IMPORT REACT
import { useState, useEffect, useRef } from 'react';
import { ManageMenu } from './ManageMenu';

// IMPORT COMPONENTS
import { ColumnMenu } from './ColumnMenu';
import type { ColumnType } from '../types';

interface BannerProps {
  addNewTask: () => void;
  isNavbarHidden: boolean;
  isMobile: boolean;
  canCreateTask: boolean;
  columns: ColumnType[] | null | undefined;
  onColumnDeleted: (columndId: string) => void;
  onColumnEdited: (column: ColumnType) => void;
  onColumnsReordered: (columns: ColumnType[]) => Promise<void>;
}

export function Banner({
  addNewTask,
  isNavbarHidden,
  isMobile,
  canCreateTask,
  columns,
  onColumnDeleted,
  onColumnEdited,
  onColumnsReordered,
}: BannerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState<boolean>(false);
  const columnMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current?.contains(e.target as Node)) {
        setIsMenuOpen((prev) => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <header
      className={`${isNavbarHidden ? 'sm:col-span-5 md:col-span-6' : ''} ${isMobile && !isNavbarHidden ? 'row-start-1 z-1' : ''}relative col-span-4 sm:col-span-3 md:col-span-4 flex flex-row items-center justify-between dark:bg-card-dark bg-main-white w-full px-6 py-6 row-span-1 flex-wrap border-b border-secondary-text/20`}
    >
      <div className="text-2xl font-semibold dark:text-primary-text text-action">
        Platform Launch
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
    </header>
  );
}
