import { Column } from './Column';

export function BoardContent() {
  return (
    <div className="flex flex-row gap-x-6 pt-6 pb-2 px-6 col-span-3 md:col-span-4 row-span-8 sm:row-span-9 w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar-x dark:bg-main-dark bg-white">
      {/* TODO COLUMN */}
      <Column
        name="TODO"
        tasks={[
          { id: '1', title: 'Build UI for onboarding flow', end_date: 'Never' },
          { id: '2', title: 'Build UI for search', end_date: 'Never' },
          { id: '3', title: 'Build Settings UI', end_date: 'Never' },
          {
            id: '4',
            title: 'QA and test all major user journeys',
            end_date: 'Never',
          },
        ]}
      />
      {/* DOING COLUMN */}
      <Column
        name="DOING"
        tasks={[
          {
            id: '5',
            title: 'Design settings and search pages',
            end_date: 'Never',
          },
          {
            id: '6',
            title: 'Add account management endpoints',
            end_date: 'Never',
          },
          { id: '7', title: 'Design onboarding flow', end_date: 'Never' },
          { id: '8', title: 'Add search endpoints', end_date: 'Never' },
          {
            id: '9',
            title: 'Add authentification endpoints',
            end_date: 'Never',
          },
          {
            id: '10',
            title:
              'Research pricing points of various competitors and trial different business models',
            end_date: 'Never',
          },
        ]}
      />
      {/* DONE COLUMN */}
      <Column
        name="DONE"
        tasks={[
          { id: '11', title: 'Conduct 5 wireframe tests', end_date: 'Never' },
          { id: '12', title: 'Create wireframe prototype', end_date: 'Never' },
          {
            id: '13',
            title: 'Review results of usability tests and iterate',
            end_date: 'Never',
          },
          {
            id: '14',
            title:
              'Create paper prototypes and conduct 10 usability tests with potential customers',
            end_date: 'Never',
          },
          { id: '15', title: 'Market discovery', end_date: 'Never' },
          { id: '16', title: 'Competitor analysis', end_date: 'Never' },
          { id: '17', title: 'Research the market', end_date: 'Never' },
        ]}
      />
      {/* NEW COLUMN */}
      <button className="dark:bg-card-dark bg-main-white rounded-xl font-bold cursor-pointer hover:dark:bg-card-dark/60 hover:bg-main-dark/20 transition-colors w-80 shrink-0 h-full">
        <p className="text-2xl dark:text-primary-text text-card-dark/60">
          + New Column
        </p>
      </button>
    </div>
  );
}
