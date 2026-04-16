import { GripVertical, Pencil, Trash, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { BoardType } from '../types';
import { supabase } from '../supabase';

interface BoardMenuProps {
  ref: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  boards: BoardType[] | null | undefined;
  onEdit: (board: BoardType) => void;
  onReorder: (boards: BoardType[]) => Promise<void>;
  onDelete: (boardId: string) => void;
}

type MenuMode = 'list' | 'edit' | 'delete';

/**
 * Keeps board order deterministic in the UI, even when legacy rows are missing
 * a `position` value in Supabase.
 */
function sortBoards(boards: BoardType[]) {
  return [...boards].sort((a, b) => {
    const leftPosition = a.position ?? Number.MAX_SAFE_INTEGER;
    const rightPosition = b.position ?? Number.MAX_SAFE_INTEGER;

    return leftPosition - rightPosition;
  });
}

export function BoardMenu({
  ref,
  onClose,
  boards,
  onEdit,
  onReorder,
  onDelete,
}: BoardMenuProps) {
  /**
   * Memoized ordering avoids resorting on every render and ensures drag/drop
   * starts from a stable source of truth provided by parent state.
   */
  const orderedBoards = useMemo(() => sortBoards(boards ?? []), [boards]);

  const [mode, setMode] = useState<MenuMode>('list');
  const [selectedBoard, setSelectedBoard] = useState<BoardType | null>(null);
  const [boardName, setBoardName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [draggedBoardId, setDraggedBoardId] = useState<string | null>(null);
  const [localBoards, setLocalBoards] = useState<BoardType[]>(orderedBoards);

  /**
   * Re-sync local drag state whenever upstream boards change (e.g. remote update
   * or parent refresh), so the modal never shows stale ordering.
   */
  useEffect(() => {
    setLocalBoards(orderedBoards);
  }, [orderedBoards]);

  /**
   * Centralized reset when leaving edit mode to avoid carrying validation or
   * loading state into future edits.
   */
  function closeEditMode() {
    setSelectedBoard(null);
    setBoardName('');
    setErrorMessage('');
    setIsSubmitting(false);
    setMode('list');
  }

  /**
   * Preloads form state from the selected board so edits are explicit and
   * reversible before persisting to Supabase.
   */
  function startEditing(board: BoardType) {
    setSelectedBoard(board);
    setBoardName(board.name);
    setErrorMessage('');
    setMode('edit');
  }

  /**
   * Moves into a confirmation state before destructive actions to reduce
   * accidental deletions.
   */
  function startDeleting(board: BoardType) {
    setSelectedBoard(board);
    setMode('delete');
  }

  /**
   * Persists a board name update to Supabase, then notifies the parent so shared
   * app state reflects the server-confirmed value.
   */
  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedBoard) {
      return;
    }

    if (!boardName.trim()) {
      setErrorMessage("Your board can't have an empty name");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('boards')
      .update({ name: boardName.trim() })
      .eq('id', selectedBoard.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      console.log(error.message);
      setErrorMessage('Unable to update this board.');
      return;
    }

    onEdit(data as BoardType);
    closeEditMode();
  }

  /**
   * Handles HTML5 DnD reordering locally for immediate feedback, then delegates
   * persistence to `onReorder` so parent/server state stays canonical.
   */
  async function handleDrop(targetBoardId: string) {
    if (!draggedBoardId || draggedBoardId === targetBoardId) {
      setDraggedBoardId(null);
      return;
    }

    // Work on a copy to keep React state immutable and predictable.
    const currentBoards = [...localBoards];
    const draggedIndex = currentBoards.findIndex(
      (board) => board.id === draggedBoardId
    );
    const targetIndex = currentBoards.findIndex(
      (board) => board.id === targetBoardId
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedBoardId(null);
      return;
    }

    const [draggedBoard] = currentBoards.splice(draggedIndex, 1);
    currentBoards.splice(targetIndex, 0, draggedBoard);

    // Recompute contiguous positions so persisted order is deterministic.
    const reorderedBoards = currentBoards.map((board, index) => ({
      ...board,
      position: index,
    }));

    setLocalBoards(reorderedBoards);
    setDraggedBoardId(null);
    await onReorder(reorderedBoards);
  }

  /**
   * Deletes entities in dependency order (tasks -> columns -> board) to align
   * with relational constraints and prevent partial orphaned data.
   */
  async function handleDeleteBoard() {
    if (!selectedBoard) {
      return;
    }

    setIsSubmitting(true);

    const { error: taskDeleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('board', selectedBoard.id);

    if (taskDeleteError) {
      setIsSubmitting(false);
      console.log(taskDeleteError.message);
      return;
    }

    const { error: columnDeleteError } = await supabase
      .from('columns')
      .delete()
      .eq('board', selectedBoard.id);

    if (columnDeleteError) {
      setIsSubmitting(false);
      console.log(columnDeleteError.message);
      return;
    }

    const { error: boardDeleteError } = await supabase
      .from('boards')
      .delete()
      .eq('id', selectedBoard.id);

    setIsSubmitting(false);

    if (boardDeleteError) {
      console.log(boardDeleteError.message);
      return;
    }

    onDelete(selectedBoard.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
      <div
        ref={ref}
        className="dark:bg-card-dark bg-main-white rounded-lg p-8 w-full max-w-md shadow-2xl"
      >
        {mode === 'list' && (
          <>
            <div className="flex flex-row items-start justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1 dark:text-primary-text text-card-dark/60">
                  Manage Boards
                </h2>
                <p className="text-sm dark:text-secondary-text text-card-dark/50">
                  Drag a board to change its order.
                </p>
              </div>
              <button
                className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                onClick={onClose}
              >
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-y-2 mt-6">
              {localBoards.map((board) => (
                <div
                  key={board.id}
                  draggable
                  onDragStart={() => setDraggedBoardId(board.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => void handleDrop(board.id)}
                  onDragEnd={() => setDraggedBoardId(null)}
                  className={`flex flex-row items-center justify-between gap-x-3 px-3 py-2 rounded-lg border transition-colors ${
                    draggedBoardId === board.id
                      ? 'border-action bg-action/20'
                      : 'dark:border-secondary-text/20 border-action/20'
                  }`}
                >
                  <div className="flex flex-row items-center gap-x-3 min-w-0">
                    <button
                      type="button"
                      className="cursor-grab dark:text-secondary-text text-card-dark/50"
                    >
                      <GripVertical size={18} />
                    </button>
                    <span className="dark:text-primary-text text-card-dark/60 font-semibold truncate">
                      {board.name}
                    </span>
                  </div>
                  <div className="flex flex-row gap-x-2 items-center">
                    <button
                      onClick={() => startEditing(board)}
                      className="p-1 bg-action hover:bg-action/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => startDeleting(board)}
                      className="p-1 bg-red-400 hover:bg-red-400/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {mode === 'edit' && selectedBoard && (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-y-6">
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold dark:text-primary-text text-card-dark/60">
                Edit Board
              </h2>
              <button
                type="button"
                className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                onClick={closeEditMode}
              >
                <X />
              </button>
            </div>

            <label className="flex flex-col gap-y-2">
              <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                Name
              </span>
              <input
                type="text"
                placeholder="e.g. Project Alpha"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="font-semibold outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:text-primary-text text-card-dark/60 text-sm"
              />
            </label>

            <div className="flex flex-col gap-y-4">
              {errorMessage && (
                <p className="text-red-500 font-semibold text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-row gap-x-4">
                <button
                  type="button"
                  onClick={closeEditMode}
                  className="w-full border border-action/40 py-2 rounded-full cursor-pointer font-semibold hover:bg-action/10 transition-colors dark:text-primary-text text-card-dark/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save changes
                </button>
              </div>
            </div>
          </form>
        )}
        {mode === 'delete' && selectedBoard && (
          <div className="flex flex-col items-start justify-between">
            <h2 className="text-lg font-bold mb-2 dark:text-primary-text text-card-dark/60">
              Delete Board
            </h2>
            <p className="dark:text-secondary-text text-card-dark/60 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedBoard.name}</span>?
            </p>
            <div className="flex flex-row w-full gap-x-4 justify-between">
              <button
                onClick={() => setMode('list')}
                className="bg-green-400 py-2 w-full cursor-pointer hover:bg-green-300 transition-colors rounded-full font-bold"
              >
                No
              </button>
              <button
                onClick={() => void handleDeleteBoard()}
                disabled={isSubmitting}
                className="bg-red-400 py-2 w-full cursor-pointer hover:bg-red-300 transition-colors rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
