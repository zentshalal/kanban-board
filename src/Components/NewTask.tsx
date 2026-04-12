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
            className="bg-card-dark rounded-lg p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex flex-row items-start justify-between">
              <h2 className="text-lg font-bold mb-4 text-white">
                Add New Task
              </h2>
              <button
                className="rounded-full hover:bg-action p-1 cursor-pointer transition-colors"
                onClick={onClose}
              >
                <X />
              </button>
            </div>

            <div className="gap-y-6 flex flex-col w-full">
              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm">Title</span>
                <input
                  type="text"
                  placeholder="e.g. Take a coffee break"
                  className="outline-none border-2 border-secondary-text/40 rounded-lg px-2 py-2 placeholder:text-secondary-text/40 text-sm"
                />
              </label>

              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm">
                  Description
                </span>
                <textarea
                  placeholder="e.g. It's always good to take a break. This 15 minutes break will recharge the batteries a little."
                  className="outline-none border-2 border-secondary-text/40 rounded-lg px-2 py-2 placeholder:text-secondary-text/40 text-sm resize-none"
                  rows={5}
                ></textarea>
              </label>

              <label className="flex flex-col gap-y-2 w-full">
                <span className="font-bold tracking-wider text-sm">Status</span>
                <div className="w-full relative">
                  <select
                    name="status"
                    id="status"
                    className="outline-none border-2 appearance-none border-secondary-text/40 rounded-md p-2 text-sm font-semibold bg-card-dark w-full "
                  >
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown
                      size={16}
                      strokeWidth={3}
                      className="text-action"
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
