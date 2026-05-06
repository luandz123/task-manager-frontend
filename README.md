# DevTask Frontend — Premium Team Management Interface

DevTask is a high-performance, aesthetically pleasing task management dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. It features a modern Kanban board, project workspace, and a secure authentication flow.

![DevTask Banner](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Key Features

- **🚀 Premium UI/UX**: Designed with glassmorphism, smooth Framer Motion animations, and a curated OKLCH color palette.
- **📋 Kanban Board**: Manage tasks through columns (To Do, In Progress, Done) with real-time status updates.
- **🔐 Secure Auth**: JWT-based authentication with protected routes and persistent sessions.
- **📱 Responsive**: Fully optimized for mobile, tablet, and desktop experiences.
- **🎨 Modern Stack**: Built with Vite for lightning-fast development and optimized production bundles.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Context API
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API Client**: [Axios](https://axios-http.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/luandz123/task-manager-frontend.git
   cd task-manager-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```text
src/
├── api/          # Axios configuration and interceptors
├── components/   # Reusable UI components (Header, etc.)
├── context/      # AuthContext and global state
├── pages/        # Main view components (Dashboard, Board, Auth)
├── App.tsx       # Routing and layout logic
└── main.tsx      # Application entry point
```

## 📄 License

This project is licensed under the MIT License.
