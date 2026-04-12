import { ChevronDown, X } from 'lucide-react';

import { useRef, useEffect } from 'react';

interface NewTaskProps {
  isVisible: boolean;
  onClose: () => void;
}

export function NewTask({ isVisible, onClose }: NewTaskProps) {
  const containerRef = useRef(null);

  // Handles click outside the menu to close it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current?.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
          <form
            ref={containerRef}
            className="dark:bg-card-dark bg-main-white rounded-lg p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold mb-4 dark:text-primary-text text-card-dark/60">
                Add New Task
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
                  Title
                </span>
                <input
                  type="text"
                  placeholder="e.g. Take a coffee break"
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-sm"
                />
              </label>

              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Description
                </span>
                <textarea
                  placeholder="e.g. It's always good to take a break. This 15 minutes break will recharge the batteries a little."
                  className="outline-none border-2 dark:border-secondary-text/40 border-action/40 rounded-lg px-2 py-2 dark:placeholder:text-secondary-text/40 placeholder:text-action/40 text-sm resize-none"
                  rows={5}
                ></textarea>
              </label>

              <label className="flex flex-col gap-y-2 w-full">
                <span className="font-bold tracking-wider text-sm dark:text-primary-text text-card-dark/60">
                  Status
                </span>
                <div className="w-full relative">
                  <select
                    name="status"
                    id="status"
                    className="outline-none border-2 appearance-none dark:border-secondary-text/40 border-action/40 rounded-md p-2 text-sm font-semibold dark:bg-card-dark bg-main-white w-full dark:text-primary-text text-action/40 "
                  >
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown
                      size={16}
                      strokeWidth={3}
                      className="dark:text-action text-action/40"
                    />
                  </div>
                </div>
              </label>

              <button className="w-full bg-action py-2 rounded-full cursor-pointer font-semibold hover:bg-action/80 transition-colors">
                <span className="text-sm">Create Task</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
