# 🌟 Kanban - React CRUD Organizer

A robust, Trello-inspired project management tool built for performance and data security.

## 🚀 Live Demo

Live Demo: <a href="https://kanban-board-psi-inky.vercel.app/" target="_blank">https://kanban-board-psi-inky.vercel.app/</a>

## ✨ Key Features

- **Secure Authentication**: Full Login/Signup system powered by Supabase auth
- **Multi-Boards & Columns**: Hierarchical organization of tasks by projects and stages
- **Advanced Drag & Drop**: Fluid interface for moving tasks between columns (mobile-optimized via long-press)
- **Real-Time Persistance**: Immediate synchronization with a PostgreSQL database (Supabase)
- **Row Level Security**: Complete data isolation, users can only access and modify their own boards

## 📸 Screenshots

<img src="" alt="" />

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Language**: Typescript (First time using it)
- **Styling**: Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL)
- **Drag & Drop**: @hello-pangea/dnd

## 🧠 What I learned

- **First Dive In Typescript**: I used complex interface to structure data flow between the frontend and the database
- **Database Security**: Configured SQL policies directly in Supabase to ensure user data privacy
- **Complex State Mangement**: Managed nested React states (Boards > Columns > Tasks) while handling UI synchronization during DnD events
- **Mobile UX**: Adapted a complex desktop interface for a smooth touch experience

## 🏗️ Database Architecture

The application relies on an optimized relational structure:

- **Profiles**: Linked to Supabase Auth
- **Boards**: Belong to a specific user
- **Columns**: Belong to a specific Board
- **Tasks**: Linked to a column and a user

## 🎯 The Struggles

- **Drag & Drop**: I had some difficulties setting up the DnD and used AI to help me implement it
- **File Structuration**: I think that I could have done better organizing myself with folders/files (App.tsx has 500lines...)

## ⚙️ Installation & Setup

If you want to run this project locally:

**Clone the repository**:

```bash
git clone https://github.com/zentshalal/kanban-board.git
```

**Install dependencies**:

```bash
npm install
```

**Setting up the environment variables**:\*\*
Create a .env file with your Supabase credentials:

```bash
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Start the development server**:

```bash
npm run dev
```

## 🤝 Contributing

This project was developed as part of my self-taught journey to master full-stack web development fundamentals. Feel free to fork the repository or suggest improvements!

## 📬 Contact

**GitHub**: zentshalal
