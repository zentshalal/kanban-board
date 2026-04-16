// IMPORT ICONS
import { GripVertical, Pencil, Trash, X } from 'lucide-react';

// IMPORT TYPES
import type { ColumnType } from '../types';

// IMPORT REACT
import { useEffect, useMemo, useState } from 'react';

// IMPORT SUPABASE
import { supabase } from '../supabase';

interface ColumnMenuProps {
  ref: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  columns: ColumnType[] | null | undefined;
  onDelete: (columnId: string) => void;
  onEdit: (column: ColumnType) => void;
  onReorder: (columns: ColumnType[]) => Promise<void>;
}

type MenuMode = 'list' | 'edit' | 'delete';

function sortColumns(columns: ColumnType[]) {
  return [...columns].sort((a, b) => {
    const leftPosition = a.position ?? Number.MAX_SAFE_INTEGER;
    const rightPosition = b.position ?? Number.MAX_SAFE_INTEGER;

    return leftPosition - rightPosition;
  });
}

export function ColumnMenu({
  ref,
  onClose,
  columns,
  onDelete,
  onEdit,
  onReorder,
}: ColumnMenuProps) {
  const orderedColumns = useMemo(() => sortColumns(columns ?? []), [columns]);

  const [mode, setMode] = useState<MenuMode>('list');
  const [selectedColumn, setSelectedColumn] = useState<ColumnType | null>(null);
  const [columnName, setColumnName] = useState<string>('');
  const [columnColor, setColumnColor] = useState<string>('#635fc7');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState<ColumnType[]>(orderedColumns);

  useEffect(() => {
    setLocalColumns(orderedColumns);
  }, [orderedColumns]);

  function resetForm() {
    setColumnName('');
    setColumnColor('#635fc7');
    setErrorMessage('');
    setIsSubmitting(false);
  }

  function closeEditMode() {
    setSelectedColumn(null);
    setMode('list');
    resetForm();
  }

  function startEditing(column: ColumnType) {
    setSelectedColumn(column);
    setColumnName(column.name);
    setColumnColor(column.color || '#635fc7');
    setErrorMessage('');
    setMode('edit');
  }

  function startDeleting(column: ColumnType) {
    setSelectedColumn(column);
    setMode('delete');
  }

  async function deleteColumn(column: ColumnType | null) {
    if (!column) {
      return;
    }

    const { data, error } = await supabase
      .from('columns')
      .delete()
      .eq('id', column.id)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.length > 0) {
      onDelete(column.id);
      const { error: taskDeleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('column', column.id);

      if (taskDeleteError) {
        console.log(taskDeleteError);
        return;
      }

      onClose();
    } else {
      console.log('Aucune colonne trouvee avec cette ID');
    }
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedColumn) {
      return;
    }

    if (!columnName.trim()) {
      setErrorMessage("Your column can't have an empty name");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: columnName.trim(),
      color: columnColor,
    };

    const { data, error } = await supabase
      .from('columns')
      .update(payload)
      .eq('id', selectedColumn.id)
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      console.log(error.message);
      setErrorMessage('Unable to update this column.');
      return;
    }

    onEdit(data as ColumnType);
    closeEditMode();
  }

  async function handleDrop(targetColumnId: string) {
    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      setDraggedColumnId(null);
      return;
    }

    const currentColumns = [...localColumns];
    const draggedIndex = currentColumns.findIndex(
      (column) => column.id === draggedColumnId
    );
    const targetIndex = currentColumns.findIndex(
      (column) => column.id === targetColumnId
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumnId(null);
      return;
    }

    const [draggedColumn] = currentColumns.splice(draggedIndex, 1);
    currentColumns.splice(targetIndex, 0, draggedColumn);

    const reorderedColumns = currentColumns.map((column, index) => ({
      ...column,
      position: index,
    }));

    setLocalColumns(reorderedColumns);
    setDraggedColumnId(null);
    await onReorder(reorderedColumns);
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
                  Manage Columns
                </h2>
                <p className="text-sm dark:text-secondary-text text-card-dark/50">
                  Drag a column to change its order.
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
              {localColumns.map((column) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={() => setDraggedColumnId(column.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => void handleDrop(column.id)}
                  onDragEnd={() => setDraggedColumnId(null)}
                  className={`flex flex-row items-center justify-between gap-x-3 px-3 py-2 rounded-lg border transition-colors ${
                    draggedColumnId === column.id
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
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: column.color || '#635fc7' }}
                    ></div>
                    <span className="dark:text-primary-text text-card-dark/60 font-semibold truncate">
                      {column.name}
                    </span>
                  </div>
                  <div className="flex flex-row gap-x-2 shrink-0">
                    <button
                      onClick={() => startEditing(column)}
                      className="p-1 bg-action hover:bg-action/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => startDeleting(column)}
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

        {mode === 'edit' && selectedColumn && (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-y-6">
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold dark:text-primary-text text-card-dark/60">
                Edit Column
              </h2>
              <button
                type="button"
                className="rounded-full dark:hover:bg-action hover:bg-action/40 p-1 cursor-pointer transition-colors dark:text-primary-text text-card-dark/60"
                onClick={closeEditMode}
              >
                <X />
              </button>
            </div>

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
                  className="dark:text-primary-text text-card-dark/60 outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 font-semibold text-sm"
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

        {mode === 'delete' && (
          <div className="flex flex-col items-start justify-between">
            <h2 className="text-lg font-bold mb-2 dark:text-primary-text text-card-dark/60">
              Delete Column
            </h2>
            <p className="dark:text-secondary-text text-card-dark/60 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedColumn?.name}</span>?
            </p>
            <div className="flex flex-row w-full gap-x-4 justify-between">
              <button
                onClick={() => setMode('list')}
                className="bg-green-400 py-2 w-full cursor-pointer hover:bg-green-300 transition-colors rounded-full font-bold"
              >
                No
              </button>
              <button
                onClick={() => void deleteColumn(selectedColumn)}
                className="bg-red-400 py-2 w-full cursor-pointer hover:bg-red-300 transition-colors rounded-full font-bold"
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
