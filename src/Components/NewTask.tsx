import { useState } from 'react';

export function NewTask() {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-dark rounded-lg p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-white">Add New Task</h2>
            <div className="gap-y-6 flex flex-col">
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
              <label className="flex flex-col gap-y-2">
                <span className="font-bold tracking-wider text-sm">Due To</span>
                <input type="text" />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
